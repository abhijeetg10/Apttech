import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const adminToDelete = await prisma.user.findUnique({ where: { id } });
    if (!adminToDelete) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    // Protect the master admin
    if (adminToDelete.email === 'apttechtest.in@gmail.com') {
      return NextResponse.json({ error: "Cannot delete the master administrator" }, { status: 403 });
    }

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete admin" }, { status: 500 });
  }
}
