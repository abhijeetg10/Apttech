import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkBatch() {
  const batches = await prisma.batch.findMany();
  console.log("Batches:", batches.map(b => ({ name: b.name, driveFolderId: b.driveFolderId })));
}

checkBatch()
  .then(() => prisma.$disconnect())
  .catch(console.error);
