import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import bcrypt from "bcryptjs";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const students = await prisma.user.findMany({
      where: { role: 'STUDENT' },
      include: { batch: true },
    });
    
    // Natural sort by rollNumber (e.g. JDBC699 comes before JDBC6100)
    students.sort((a, b) => {
      const rollA = a.rollNumber || "";
      const rollB = b.rollNumber || "";
      return rollA.localeCompare(rollB, undefined, { numeric: true, sensitivity: 'base' });
    });

    // Don't send passwords back
    const safeStudents = students.map(({ password, ...rest }) => rest);
    return NextResponse.json(safeStudents);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, email, batchId } = body;

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    const newStudent = await prisma.user.create({
      data: {
        name,
        email,
        role: "STUDENT",
        batchId: batchId || null,
      },
    });

    const { password: _, ...safeStudent } = newStudent;
    return NextResponse.json(safeStudent, { status: 201 });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "A user with this email already exists" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create student" }, { status: 500 });
  }
}
