// Congestion address ke requests lo, service se kaam karwao, response bhejo
import { Request, Response } from "express";
import {
  createCongestionAddress,
  deleteCongestionAddress,
  getAllCongestionAddresses,
  updateCongestionAddress,
} from "./congestionAddress.service.js";

// GET /api/congestion-addresses
export async function getCongestionAddresses(req: Request, res: Response) {
  const addresses = await getAllCongestionAddresses();
  res.json(addresses);
}

// POST /api/congestion-addresses
export async function addCongestionAddress(req: Request, res: Response) {
  const address = await createCongestionAddress(req.body);
  res.status(201).json(address);
}

// PUT /api/congestion-addresses/:id
export async function editCongestionAddress(req: Request<{ id: string }>, res: Response) {
  const address = await updateCongestionAddress(req.params.id, req.body);
  res.json(address);
}

// DELETE /api/congestion-addresses/:id
export async function removeCongestionAddress(req: Request<{ id: string }>, res: Response) {
  await deleteCongestionAddress(req.params.id);
  res.json({ message: "Congestion address deleted" });
}
