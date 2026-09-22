import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const batches = await prisma.batch.findMany({
      orderBy: { startDate: 'desc' },
      include: {
        _count: {
          select: { students: true, lectures: true }
        }
      }
    });
    return NextResponse.json(batches);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch batches" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, faculty, driveFolderId, status, startDate } = body;

    if (!name) {
      return NextResponse.json({ error: "Batch name is required" }, { status: 400 });
    }

    const newBatch = await prisma.batch.create({
      data: {
        name,
        faculty,
        driveFolderId,
        status: status || "Active",
        startDate: startDate ? new Date(startDate) : null,
      },
    });

    return NextResponse.json(newBatch, { status: 201 });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "A batch with this name already exists" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create batch" }, { status: 500 });
  }
}
