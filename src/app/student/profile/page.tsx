import UserProfile from "@/components/profile/UserProfile";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function StudentProfilePage() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user || !session.user.email) {
    redirect("/");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { batch: true }
  });

  if (!user) {
    redirect("/");
  }

  return (
    <div style={{ padding: "2rem" }}>
      <UserProfile 
        initialName={user.name} 
        email={user.email} 
        batchName={user.batch?.name}
        role={user.role}
        rollNumber={user.rollNumber}
        collegeName={user.collegeName}
      />
    </div>
  );
}
