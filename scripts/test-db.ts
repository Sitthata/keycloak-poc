import { db } from "../src/db";

async function main() {
  try {
    await db.$connect();
    console.log("Successfully connected to the database");
    const userCount = await db.user.count();
    console.log(`User count: ${userCount}`);
  } catch (e) {
    console.error("Error connecting to database:", e);
    process.exit(1);
  } finally {
    await db.$disconnect();
  }
}

main();
