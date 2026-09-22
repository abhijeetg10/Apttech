import Layout from "@/components/layout/Layout";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "STUDENT") {
    redirect("/");
  }

  const user = {
    name: session.user?.name || "Student",
    role: "STUDENT",
  };

  return (
    <Layout role="STUDENT" user={user}>
      {children}
    </Layout>
  );
}
