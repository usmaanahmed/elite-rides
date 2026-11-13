// Night surcharge ke requests lo, service se kaam karwao, response bhejo
import { Request, Response } from "express";
import {
  createSurchargeNight,
  deleteSurchargeNight,
  getAllSurchargeNights,
  updateSurchargeNight,
} from "./surchargeNight.service.js";

// GET /api/surcharge-night
export async function getSurchargeNights(req: Request, res: Response) {
  const surcharges = await getAllSurchargeNights();
  res.json(surcharges);
}

// POST /api/surcharge-night
export async function addSurchargeNight(req: Request, res: Response) {
  const surcharge = await createSurchargeNight(req.body);
  res.status(201).json(surcharge);
}

// PUT /api/surcharge-night/:id
export async function editSurchargeNight(req: Request<{ id: string }>, res: Response) {
  const surcharge = await updateSurchargeNight(req.params.id, req.body);
  res.json(surcharge);
}

// DELETE /api/surcharge-night/:id
export async function removeSurchargeNight(req: Request<{ id: string }>, res: Response) {
  await deleteSurchargeNight(req.params.id);
  res.json({ message: "Surcharge night deleted" });
}
