import styles from "./LecturesLibrary.module.css";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import LectureList from "@/components/student/LectureList";

export const dynamic = 'force-dynamic';

export default async function LecturesLibrary() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user || !session.user.email) return null;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { batch: { include: { lectures: { orderBy: { date: 'desc' } } } } }
  });

  const lectures = user?.batch?.lectures || [];

  return (
    <div className={styles.library}>
      <div className={styles.header}>
        <div>
          <h1>Lectures Library</h1>
          <p>Watch, Learn and Build Your Future</p>
        </div>
      </div>

      <LectureList lectures={lectures} />
    </div>
  );
}
