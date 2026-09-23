import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import bcrypt from "bcryptjs";

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, collegeName, rollNumber } = body;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const dataToUpdate: any = {};

    if (name !== undefined && name !== user.name) {
      dataToUpdate.name = name;
    }
    
    if (collegeName !== undefined && collegeName !== user.collegeName) {
      dataToUpdate.collegeName = collegeName;
    }
    
    if (rollNumber !== undefined && rollNumber !== user.rollNumber) {
      dataToUpdate.rollNumber = rollNumber;
    }

    if (Object.keys(dataToUpdate).length === 0) {
       return NextResponse.json({ message: "No changes made" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: dataToUpdate
    });

    return NextResponse.json({ success: true, message: "Profile updated successfully" });

  } catch (error: any) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
