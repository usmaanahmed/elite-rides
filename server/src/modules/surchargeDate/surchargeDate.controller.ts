// Surcharge on date ke requests lo, service se kaam karwao, response bhejo
import { Request, Response } from "express";
import {
  createSurchargeDate,
  deleteSurchargeDate,
  getAllSurchargeDates,
  updateSurchargeDate,
} from "./surchargeDate.service.js";

// GET /api/surcharge-dates
export async function getSurchargeDates(req: Request, res: Response) {
  const surcharges = await getAllSurchargeDates();
  res.json(surcharges);
}

// POST /api/surcharge-dates
export async function addSurchargeDate(req: Request, res: Response) {
  const surcharge = await createSurchargeDate(req.body);
  res.status(201).json(surcharge);
}

// PUT /api/surcharge-dates/:id
export async function editSurchargeDate(req: Request<{ id: string }>, res: Response) {
  const surcharge = await updateSurchargeDate(req.params.id, req.body);
  res.json(surcharge);
}

// DELETE /api/surcharge-dates/:id
export async function removeSurchargeDate(req: Request<{ id: string }>, res: Response) {
  await deleteSurchargeDate(req.params.id);
  res.json({ message: "Surcharge date deleted" });
}
