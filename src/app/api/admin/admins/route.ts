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
    const admins = await prisma.user.findMany({
      where: { role: 'ADMIN' }
    });
    
    const safeAdmins = admins.map(({ password, ...rest }) => rest);
    return NextResponse.json(safeAdmins);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch admins" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, email } = body;

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    const newAdmin = await prisma.user.create({
      data: {
        name,
        email,
        role: "ADMIN"
      }
    });

    const { password, ...safeAdmin } = newAdmin;
    return NextResponse.json(safeAdmin, { status: 201 });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "A user with this email already exists" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create admin" }, { status: 500 });
  }
}
