// Ban address ke requests lo, service se kaam karwao, response bhejo
import { Request, Response } from "express";
import { createBanAddress, deleteBanAddress, getAllBanAddresses } from "./banAddress.service.js";

// GET /api/ban-addresses
export async function getBanAddresses(req: Request, res: Response) {
  const addresses = await getAllBanAddresses();
  res.json(addresses);
}

// POST /api/ban-addresses
export async function addBanAddress(req: Request, res: Response) {
  const address = await createBanAddress(req.body);
  res.status(201).json(address);
}

// DELETE /api/ban-addresses/:id
export async function removeBanAddress(req: Request<{ id: string }>, res: Response) {
  await deleteBanAddress(req.params.id);
  res.json({ message: "Banned address removed" });
}
