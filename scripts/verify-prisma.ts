import { PrismaClient } from "@prisma/client";

try {
  const prisma = new PrismaClient();
  console.log("Prisma Client successfully instantiated!");
  process.exit(0);
} catch (e) {
  console.error("Failed to instantiate Prisma Client:", e);
  process.exit(1);
}
