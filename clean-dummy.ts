import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanDummyData() {
  const deleted = await prisma.lecture.deleteMany({
    where: { driveVideoId: null }
  });
  console.log("Deleted dummy lectures:", deleted.count);
}

cleanDummyData()
  .then(() => prisma.$disconnect())
  .catch(console.error);
