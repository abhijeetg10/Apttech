import Layout from "@/components/layout/Layout";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "ADMIN") {
    redirect("/");
  }

  const user = {
    name: session.user?.name || "Admin",
    role: "ADMIN",
  };

  return (
    <Layout role="ADMIN" user={user}>
      {children}
    </Layout>
  );
}
