import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkLectures() {
  const lectures = await prisma.lecture.findMany();
  console.log("Lectures count:", lectures.length);
  if (lectures.length > 0) {
    console.log("First lecture:", lectures[0]);
  }
}

checkLectures()
  .then(() => prisma.$disconnect())
  .catch(console.error);
