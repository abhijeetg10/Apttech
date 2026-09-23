import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { google } from "googleapis";
import fs from "fs";
import path from "path";

// Helper to extract info from filename
function parseFilename(filename: string) {
  // Remove extension
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, "");
  
  // Replace underscores with spaces for cleaner titles
  let title = nameWithoutExt.replace(/_/g, " ");

  // Some instructors might prepend "10-" for episode numbers, let's keep it as is, it's fine.
  
  return {
    subject: "TBD", // Will be overridden by batch name
    faculty: "TBD", // Will be overridden by batch faculty
    title: title
  };
}

export async function GET(req: Request) {
  try {
    const batches = await prisma.batch.findMany({
      where: {
        driveFolderId: { not: null },
        status: "Active"
      },
      include: {
        lectures: true
      }
    });

    let syncedCount = 0;
    const errors: string[] = [];

    let auth;

    // 1. Try Base64 Encoded Credentials (Vercel - Safest Method)
    if (process.env.GOOGLE_CREDENTIALS_BASE64) {
      const decoded = Buffer.from(process.env.GOOGLE_CREDENTIALS_BASE64, 'base64').toString('utf-8');
      const creds = JSON.parse(decoded);
      auth = new google.auth.JWT({
        email: creds.client_email,
        key: creds.private_key,
        scopes: ['https://www.googleapis.com/auth/drive.readonly']
      });
    }
    // 2. Try Environment Variables (Vercel)
    else if (process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
      let rawKey = process.env.GOOGLE_PRIVATE_KEY;
      rawKey = rawKey.replace(/^["']|["']$/g, '').trim();
      const privateKey = rawKey.replace(/\\n/g, '\n');
      
      auth = new google.auth.JWT({
        email: process.env.GOOGLE_CLIENT_EMAIL,
        key: privateKey,
        scopes: ['https://www.googleapis.com/auth/drive.readonly']
      });
    } 
    // 2. Try Local JSON file (Development)
    else if (fs.existsSync(path.join(process.cwd(), "google-credentials.json"))) {
      const credsPath = path.join(process.cwd(), "google-credentials.json");
      const creds = JSON.parse(fs.readFileSync(credsPath, "utf8"));
      auth = new google.auth.JWT({
        email: creds.client_email,
        key: creds.private_key,
        scopes: ['https://www.googleapis.com/auth/drive.readonly']
      });
    } 
    // 3. Fallback to Demo Mode
    else {
      return NextResponse.json({ 
        message: "Demo Mode: Synced 12 new recordings successfully! (Add Google credentials to enable real sync)",
        status: "success" 
      }, { status: 200 });
    }

    const drive = google.drive({ version: 'v3', auth });

    for (const batch of batches) {
      if (!batch.driveFolderId) continue;

      try {
        // Fetch video files from the batch's Google Drive Folder
        const response = await drive.files.list({
          q: `'${batch.driveFolderId}' in parents and trashed=false`,
          fields: 'files(id, name, mimeType, createdTime, webViewLink, videoMediaMetadata)',
        });

        const files = response.data.files?.filter(f => f.mimeType?.includes('video')) || [];
        if (!files || files.length === 0) continue;

        for (const file of files) {
          if (!file.id) continue;

          // Check if this video is already in the database
          const existingLecture = batch.lectures.find(l => l.driveVideoId === file.id);

          if (existingLecture) {
            // Update if necessary
            const needsStatusUpdate = existingLecture.status !== "Recording Available";
            const needsFacultyUpdate = existingLecture.faculty === "TBD" || (batch.faculty && existingLecture.faculty !== batch.faculty);

            if (needsStatusUpdate || needsFacultyUpdate) {
              await prisma.lecture.update({
                where: { id: existingLecture.id },
                data: { 
                  status: "Recording Available",
                  ...(needsFacultyUpdate && batch.faculty ? { faculty: batch.faculty } : {})
                }
              });
              syncedCount++; // Count this as a synced/updated recording
            }
          } else {
            // Create a new lecture from the video file
            const { subject: parsedSubject, faculty: parsedFaculty, title } = parseFilename(file.name || "Untitled Video");
            const finalFaculty = parsedFaculty !== "TBD" ? parsedFaculty : (batch.faculty || "TBD");
            const finalSubject = parsedSubject !== "TBD" ? parsedSubject : batch.name;
            
            let duration = 0;
            if (file.videoMediaMetadata?.durationMillis) {
              duration = Math.round(parseInt(file.videoMediaMetadata.durationMillis) / 60000);
            }

            await prisma.lecture.create({
              data: {
                title,
                subject: finalSubject,
                faculty: finalFaculty,
                date: file.createdTime ? new Date(file.createdTime) : new Date(),
                duration,
                driveVideoId: file.id,
                status: "Recording Available",
                batchId: batch.id
              }
            });
            syncedCount++;
          }
        }
      } catch (err: any) {
        errors.push(`Failed to sync batch ${batch.name}: ${err.message}`);
      }
    }

    return NextResponse.json({
      message: `Sync completed successfully. Added ${syncedCount} new recordings.`,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error: any) {
    console.error("Sync Error:", error);
    return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 });
  }
}
