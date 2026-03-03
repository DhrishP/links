import { db } from "../src/server/db/index";
import { admins } from "../src/server/db/schema";
import bcrypt from "bcrypt";
import * as dotenv from "dotenv";

dotenv.config();

async function seedAdmin() {
  const password = process.env.ADMIN_PASSWORD;

  if (!password) {
    console.error("ADMIN_PASSWORD is not set in .env");
    process.exit(1);
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  await db.insert(admins).values({
    username: "admin",
    passwordHash,
  });

  console.log("Successfully created admin user.");
  process.exit(0);
}

seedAdmin().catch((err) => {
  console.error("Error seeding admin:", err);
  process.exit(1);
});
