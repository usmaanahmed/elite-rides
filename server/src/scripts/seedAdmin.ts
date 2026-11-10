// Pehla admin account banata hai. Chalane ka tareeqa: npm run seed:admin
// (pehle .env me ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD set karo)
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { env } from "../config/env.js";
import { createAdmin, findAdminByEmail } from "../modules/admin/admin.repository.js";

const SALT_ROUNDS = 10;

async function seedAdmin() {
  const name = process.env.ADMIN_NAME;
  const email = process.env.ADMIN_EMAIL?.toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!name || !email || !password) {
    console.log("ADMIN_NAME, ADMIN_EMAIL aur ADMIN_PASSWORD .env me set karo, phir dobara chalao");
    return;
  }

  await mongoose.connect(env.mongoUri);

  const existingAdmin = await findAdminByEmail(email);
  if (existingAdmin) {
    console.log(`Admin "${email}" pehle se mojood hai`);
    await mongoose.disconnect();
    return;
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  await createAdmin({ name, email, passwordHash });

  console.log(`Admin "${email}" ban gaya`);
  await mongoose.disconnect();
}

seedAdmin();
