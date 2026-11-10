// Surcharge address ke requests lo, service se kaam karwao, response bhejo
import { Request, Response } from "express";
import {
  createSurchargeAddress,
  deleteSurchargeAddress,
  getAllSurchargeAddresses,
  updateSurchargeAddress,
} from "./surchargeAddress.service.js";

// GET /api/surcharge-addresses
export async function getSurchargeAddresses(req: Request, res: Response) {
  const addresses = await getAllSurchargeAddresses();
  res.json(addresses);
}

// POST /api/surcharge-addresses
export async function addSurchargeAddress(req: Request, res: Response) {
  const address = await createSurchargeAddress(req.body);
  res.status(201).json(address);
}

// PUT /api/surcharge-addresses/:id
export async function editSurchargeAddress(req: Request<{ id: string }>, res: Response) {
  const address = await updateSurchargeAddress(req.params.id, req.body);
  res.json(address);
}

// DELETE /api/surcharge-addresses/:id
export async function removeSurchargeAddress(req: Request<{ id: string }>, res: Response) {
  await deleteSurchargeAddress(req.params.id);
  res.json({ message: "Surcharge address deleted" });
}
