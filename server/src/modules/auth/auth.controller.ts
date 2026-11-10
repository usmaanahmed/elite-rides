// Auth ke requests lo, service se kaam karwao, response bhejo
import { Request, Response } from "express";
import { login } from "./auth.service.js";

// POST /api/auth/login
export async function loginAdmin(req: Request, res: Response) {
  const result = await login(req.body);
  res.json(result);
}

// GET /api/auth/me (requireAdmin middleware ne req.admin pehle se bhar diya hai)
export function getMe(req: Request, res: Response) {
  res.json(req.admin);
}
