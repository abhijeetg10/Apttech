import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const oldBatch = await prisma.batch.findUnique({ where: { name: 'JDBC-06' } });
  let correctBatch = await prisma.batch.findUnique({ where: { name: 'JDBC06' } });
  
  if (!correctBatch) {
      console.log("JDBC06 does not exist, creating it...");
      correctBatch = await prisma.batch.create({ data: { name: 'JDBC06', status: 'Active' } });
  }

  if (oldBatch) {
    // Update students
    const result = await prisma.user.updateMany({
      where: { batchId: oldBatch.id },
      data: { batchId: correctBatch.id }
    });
    
    console.log(`Updated ${result.count} students to the JDBC06 batch.`);
    
    // Delete old batch
    await prisma.batch.delete({ where: { id: oldBatch.id } });
    console.log("Removed the incorrect JDBC-06 batch.");
  } else {
    console.log("JDBC-06 batch not found, maybe already fixed?");
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
