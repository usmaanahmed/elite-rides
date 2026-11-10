// Drop down address ke requests lo, service se kaam karwao, response bhejo
import { Request, Response } from "express";
import {
  createDropdownAddress,
  deleteDropdownAddress,
  getAllDropdownAddresses,
  importDropdownAddresses,
  updateDropdownAddress,
} from "./dropdownAddress.service.js";

// GET /api/dropdown-addresses
export async function getDropdownAddresses(req: Request, res: Response) {
  const addresses = await getAllDropdownAddresses();
  res.json(addresses);
}

// POST /api/dropdown-addresses
export async function addDropdownAddress(req: Request, res: Response) {
  const address = await createDropdownAddress(req.body);
  res.status(201).json(address);
}

// POST /api/dropdown-addresses/import
export async function importAddresses(req: Request, res: Response) {
  const result = await importDropdownAddresses(req.body.rows);
  res.json(result);
}

// PUT /api/dropdown-addresses/:id
export async function editDropdownAddress(req: Request<{ id: string }>, res: Response) {
  const address = await updateDropdownAddress(req.params.id, req.body);
  res.json(address);
}

// DELETE /api/dropdown-addresses/:id
export async function removeDropdownAddress(req: Request<{ id: string }>, res: Response) {
  await deleteDropdownAddress(req.params.id);
  res.json({ message: "Address deleted" });
}
