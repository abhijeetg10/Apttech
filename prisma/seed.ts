import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log("Wiping existing data...");
  await prisma.lectureProgress.deleteMany({});
  await prisma.lecture.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.batch.deleteMany({});

  console.log("Creating Admin User...");
  const hashedPassword = await bcrypt.hash("admin", 10);
  await prisma.user.create({
    data: {
      name: "Super Admin",
      email: "admin@apttech.com",
      password: hashedPassword,
      role: "ADMIN"
    }
  });

  console.log("Creating JDBC06 Batch...");
  const jdbcBatch = await prisma.batch.create({
    data: {
      name: "JDBC06",
      driveFolderId: "1aGDaGk6dWuy_B7MCZOPp9xd1p3T5_5AD",
      status: "Active",
      startDate: new Date()
    }
  });

  console.log("Creating Students...");
  const studentPassword = await bcrypt.hash("student123", 10);
  await prisma.user.create({
    data: {
      name: "Abhijeet Student",
      email: "abhijeet@apttech.com",
      password: studentPassword,
      role: "STUDENT",
      batchId: jdbcBatch.id
    }
  });

  console.log("Creating Placeholder JDBC Lectures...");
  // Creating 12 dummy lectures for JDBC06 since we cannot fetch the live Google Drive IDs without an API key
  const lecturesData = Array.from({ length: 12 }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (12 - i)); // Past 12 days
    
    return {
      title: `JDBC Lecture ${i + 1}: Core Concepts`,
      subject: "JDBC",
      faculty: "Sagar Sir",
      date: date,
      duration: 60 + Math.floor(Math.random() * 30), // Random duration 60-90 mins
      status: "Recording Available",
      batchId: jdbcBatch.id,
      // We don't have the real Drive Video IDs yet, so video playback won't work perfectly until sync
    };
  });

  await prisma.lecture.createMany({
    data: lecturesData
  });

  console.log("Seed complete! Only JDBC06 batch exists now.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
