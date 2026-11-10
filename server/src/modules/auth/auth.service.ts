// Login ki business logic (password check karna, token banana)
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";
import { AppError } from "../../utils/AppError.js";
import { findAdminByEmail, findAdminById } from "../admin/admin.repository.js";
import { AdminRecord } from "../admin/admin.types.js";
import { AuthenticatedAdmin, LoginInput, LoginResult } from "./auth.types.js";

const TOKEN_EXPIRY = "7d";

// Admin ko frontend ke format me badalta hai (passwordHash kabhi nahi bhejta)
function toAuthenticatedAdmin(admin: AdminRecord): AuthenticatedAdmin {
  return {
    id: admin._id.toString(),
    name: admin.name,
    email: admin.email,
  };
}

export async function login(input: LoginInput): Promise<LoginResult> {
  const email = input.email.toLowerCase();
  const admin = await findAdminByEmail(email);

  // Dono cases (email na milna, password galat hona) par same message,
  // taake koi yeh na pata kar sake ke email registered hai ya nahi
  if (!admin) {
    throw new AppError("Invalid email or password", 401);
  }

  const isPasswordCorrect = await bcrypt.compare(input.password, admin.passwordHash);
  if (!isPasswordCorrect) {
    throw new AppError("Invalid email or password", 401);
  }

  const authenticatedAdmin = toAuthenticatedAdmin(admin);
  const token = jwt.sign({ adminId: authenticatedAdmin.id }, env.jwtSecret, { expiresIn: TOKEN_EXPIRY });

  return { token, admin: authenticatedAdmin };
}

// Login token se admin nikalta hai (requireAdmin middleware is ko use karta hai)
export async function getAdminFromToken(token: string): Promise<AuthenticatedAdmin> {
  let payload: { adminId: string };

  try {
    payload = jwt.verify(token, env.jwtSecret) as { adminId: string };
  } catch {
    throw new AppError("Please log in again", 401);
  }

  const admin = await findAdminById(payload.adminId);
  if (!admin) {
    throw new AppError("Please log in again", 401);
  }

  return toAuthenticatedAdmin(admin);
}
