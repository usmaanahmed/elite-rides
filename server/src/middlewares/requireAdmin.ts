// Request ke Authorization header me login token check karta hai.
// Sahi ho to req.admin bhar deta hai aur aage jaane deta hai, warna 401 error
import { NextFunction, Request, Response } from "express";
import { getAdminFromToken } from "../modules/auth/auth.service.js";
import { AppError } from "../utils/AppError.js";

export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    next(new AppError("Please log in", 401));
    return;
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    req.admin = await getAdminFromToken(token);
    next();
  } catch (error) {
    next(error);
  }
}
