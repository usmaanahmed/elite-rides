// Health module ke URLs
import { Router } from "express";
import { getHealth } from "./health.controller.js";

const router = Router();

// GET /api/health
router.get("/", getHealth);

export default router;
