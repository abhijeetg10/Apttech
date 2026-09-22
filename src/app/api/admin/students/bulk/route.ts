import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session as any).user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const students = body.students;

    if (!Array.isArray(students) || students.length === 0) {
      return NextResponse.json({ error: "No students provided" }, { status: 400 });
    }

    // Fetch all active batches for mapping
    const batches = await prisma.batch.findMany();
    const batchMap = new Map(batches.map(b => [
      b.name.toLowerCase().replace(/[\s-]/g, ""), // e.g. "jdbc06"
      b.id
    ]));
    
    let createdCount = 0;
    let skippedCount = 0;
    const errors: string[] = [];

    for (let i = 0; i < students.length; i++) {
      const s = students[i];
      if (!s.email || !s.name) {
        errors.push(`Row ${i + 1}: Missing name or email`);
        skippedCount++;
        continue;
      }

      const existingUser = await prisma.user.findUnique({ where: { email: s.email } });
      if (existingUser) {
        errors.push(`Row ${i + 1}: Email ${s.email} already exists`);
        skippedCount++;
        continue;
      }

      let batchId = null;
      if (s.batch) {
        const normalizedBatchName = String(s.batch).toLowerCase().replace(/[\s-]/g, "");
        batchId = batchMap.get(normalizedBatchName) || null;
        if (!batchId) {
           errors.push(`Row ${i + 1} (${s.name}): Batch '${s.batch}' not found. User created as unassigned.`);
        }
      }

      await prisma.user.create({
        data: {
          name: s.name,
          email: s.email,
          role: "STUDENT",
          batchId: batchId,
          rollNumber: s.rollNumber ? String(s.rollNumber) : null,
          collegeName: s.collegeName ? String(s.collegeName) : null,
        }
      });
      createdCount++;
    }

    return NextResponse.json({
      message: `Successfully created ${createdCount} students. Skipped ${skippedCount}.`,
      createdCount,
      skippedCount,
      errors
    });

  } catch (error: any) {
    console.error("Bulk upload error:", error);
    return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 });
  }
}
