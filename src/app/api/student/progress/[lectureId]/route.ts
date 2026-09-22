import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request: Request, { params }: { params: Promise<{ lectureId: string }> }) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { lectureId } = await params;

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Toggle progress
    const existingProgress = await prisma.lectureProgress.findUnique({
      where: {
        userId_lectureId: {
          userId: user.id,
          lectureId: lectureId
        }
      }
    });

    if (existingProgress) {
      // Toggle completed status
      const updated = await prisma.lectureProgress.update({
        where: { id: existingProgress.id },
        data: { completed: !existingProgress.completed }
      });
      return NextResponse.json({ success: true, completed: updated.completed });
    } else {
      // Create new progress as completed
      await prisma.lectureProgress.create({
        data: {
          userId: user.id,
          lectureId: lectureId,
          completed: true
        }
      });
      return NextResponse.json({ success: true, completed: true });
    }

  } catch (error) {
    console.error("Progress update error:", error);
    return NextResponse.json({ error: "Failed to update progress" }, { status: 500 });
  }
}
