// Auth module ke URLs
import { Router } from "express";
import { requireAdmin } from "../../middlewares/requireAdmin.js";
import { validate } from "../../middlewares/validate.js";
import { getMe, loginAdmin } from "./auth.controller.js";
import { loginSchema } from "./auth.validation.js";

const router = Router();

// POST /api/auth/login
router.post("/login", validate(loginSchema), loginAdmin);

// GET /api/auth/me
router.get("/me", requireAdmin, getMe);

export default router;
