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
    const lectures = await prisma.lecture.findMany({
      include: { batch: { select: { id: true, name: true } } },
      orderBy: { date: 'desc' }
    });
    return NextResponse.json(lectures);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch lectures" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, subject, faculty, date, duration, status, driveVideoId, meetLink, batchId } = body;

    if (!title || !subject || !faculty || !date || !batchId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newLecture = await prisma.lecture.create({
      data: {
        title,
        subject,
        faculty,
        date: new Date(date),
        duration: duration ? parseInt(duration) : null,
        status: status || "Scheduled",
        driveVideoId: driveVideoId || null,
        meetLink: meetLink || null,
        batchId,
      },
    });

    return NextResponse.json(newLecture, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to create lecture" }, { status: 500 });
  }
}
