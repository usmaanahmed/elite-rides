// Settings ke requests lo, service se kaam karwao, response bhejo
import { Request, Response } from "express";
import { getSettings, updateSettings } from "./setting.service.js";

// GET /api/settings
export async function readSettings(req: Request, res: Response) {
  const settings = await getSettings();
  res.json(settings);
}

// PUT /api/settings
export async function saveAllSettings(req: Request, res: Response) {
  const settings = await updateSettings(req.body);
  res.json(settings);
}
