import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const { title, subject, faculty, date, duration, status, driveVideoId, meetLink, batchId } = body;

    const updatedLecture = await prisma.lecture.update({
      where: { id },
      data: {
        title,
        subject,
        faculty,
        date: date ? new Date(date) : undefined,
        duration: duration ? parseInt(duration) : null,
        status,
        driveVideoId: driveVideoId || null,
        meetLink: meetLink || null,
        batchId,
      },
    });

    return NextResponse.json(updatedLecture);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update lecture" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await prisma.lecture.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete lecture" }, { status: 500 });
  }
}
