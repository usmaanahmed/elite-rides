// Night surcharge ke requests lo, service se kaam karwao, response bhejo
import { Request, Response } from "express";
import { getSurchargeNight, updateSurchargeNight } from "./surchargeNight.service.js";

// GET /api/surcharge-night
export async function readSurchargeNight(req: Request, res: Response) {
  const night = await getSurchargeNight();
  res.json(night);
}

// PUT /api/surcharge-night
export async function saveSurchargeNight(req: Request, res: Response) {
  const night = await updateSurchargeNight(req.body);
  res.json(night);
}
