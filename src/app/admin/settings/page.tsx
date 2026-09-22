import AdminSettings from "@/components/profile/AdminSettings";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function AdminSettingsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user || !session.user.email) {
    redirect("/");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });

  if (!user) {
    redirect("/");
  }

  return (
    <div style={{ padding: "2rem" }}>
      <AdminSettings 
        initialName={user.name} 
        email={user.email} 
      />
    </div>
  );
}
