import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const _global = globalThis as any;
    if (!_global['DOMMatrix']) {
      _global['DOMMatrix'] = class DOMMatrix {};
    }
    if (!_global['Path2D']) {
      _global['Path2D'] = class Path2D {};
    }
    if (!_global['ImageData']) {
      _global['ImageData'] = class ImageData {};
    }
    
    const pdfParse = require("pdf-parse");
    const session = await getServerSession(authOptions);
    if (!session || (session as any).user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No PDF file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let pdfData;
    try {
      pdfData = await pdfParse(buffer);
    } catch (e: any) {
      console.error("pdf-parse internal error:", e);
      return NextResponse.json({ error: "Failed to parse PDF document", details: e?.message || String(e) }, { status: 400 });
    }

    const text = pdfData.text as string;
    const lines = text.split(/\r?\n/).filter((l: string) => l.trim() !== "");

    // Fetch batches for mapping
    const batches = await prisma.batch.findMany();
    const batchMap = new Map(batches.map(b => [b.name.toLowerCase().replace(/[\s-]/g, ""), b.id]));

    let createdCount = 0;
    let skippedCount = 0;
    const errors: string[] = [];
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const emailMatch = line.match(emailRegex);

      if (!emailMatch) {
        continue; // Skip lines without an email address (likely headers, footers, etc.)
      }

      const email = emailMatch[0].toLowerCase();
      
      // Attempt to extract name and roll number (everything before the email)
      const emailIndex = line.indexOf(emailMatch[0]);
      let beforeEmail = line.substring(0, emailIndex).trim();
      
      let rollNumber = "";
      let name = beforeEmail;

      if (!beforeEmail && i > 0) {
         const prevLine = lines[i-1].trim();
         if (!prevLine.match(emailRegex)) {
            beforeEmail = prevLine;
            name = prevLine;
         }
      }

      if (beforeEmail) {
         const parts = beforeEmail.split(/\s+/);
         if (parts.length > 1) {
            // First part is likely roll number (e.g. JDBC601)
            rollNumber = parts[0];
            name = parts.slice(1).join(" ");
         }
      }

      if (!name) {
         errors.push(`Row ${i + 1}: Found email ${email} but couldn't parse a name.`);
         skippedCount++;
         continue;
      }

      // Attempt to extract college name (everything after email, before the 10-digit mobile number)
      const afterEmail = line.substring(emailIndex + emailMatch[0].length).trim();
      let collegeName = "";
      const mobileMatch = afterEmail.match(/\b\d{10}\b/);
      if (mobileMatch) {
         const mobileIndex = afterEmail.indexOf(mobileMatch[0]);
         collegeName = afterEmail.substring(0, mobileIndex).trim();
      } else {
         // If no mobile number, just take the first word as a fallback
         collegeName = afterEmail.split(/\s+/)[0] || "";
      }

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        errors.push(`Row ${i + 1}: Email ${email} already exists.`);
        skippedCount++;
        continue;
      }

      // Attempt to find batch from the line
      let batchId = null;
      for (const [batchNormalized, id] of batchMap.entries()) {
        if (line.toLowerCase().replace(/[\s-]/g, "").includes(batchNormalized)) {
           batchId = id;
           break;
        }
      }

      await prisma.user.create({
        data: {
          name,
          email,
          role: "STUDENT",
          batchId: batchId,
          rollNumber: rollNumber || null,
          collegeName: collegeName || null
        }
      });
      
      createdCount++;
    }

    return NextResponse.json({
      message: `Successfully created ${createdCount} students from PDF. Skipped ${skippedCount}.`,
      createdCount,
      skippedCount,
      errors
    });

  } catch (error: any) {
    console.error("PDF upload error:", error);
    return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 });
  }
}
