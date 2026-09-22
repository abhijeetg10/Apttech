import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function RedirectPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  const role = (session.user as any).role;
  
  if (role === "ADMIN") {
    redirect("/admin");
  } else {
    redirect("/student");
  }
}
