// Fixed price ke requests lo, service se kaam karwao, response bhejo
import { Request, Response } from "express";
import {
  createFixedPrices,
  deleteAllFixedPrices,
  deleteFixedPrice,
  getAllFixedPrices,
  importFixedPrices,
  updateFixedPrice,
} from "./fixedPrice.service.js";

// GET /api/fixed-prices
export async function getFixedPrices(req: Request, res: Response) {
  const fixedPrices = await getAllFixedPrices();
  res.json(fixedPrices);
}

// POST /api/fixed-prices (ek route, ek ya zyada vehicles)
export async function addFixedPrices(req: Request, res: Response) {
  const created = await createFixedPrices(req.body);
  res.status(201).json(created);
}

// POST /api/fixed-prices/import
export async function importFixedPricesHandler(req: Request, res: Response) {
  const result = await importFixedPrices(req.body.rows);
  res.json(result);
}

// PUT /api/fixed-prices/:id
export async function editFixedPrice(req: Request<{ id: string }>, res: Response) {
  const updated = await updateFixedPrice(req.params.id, req.body);
  res.json(updated);
}

// DELETE /api/fixed-prices/:id
export async function removeFixedPrice(req: Request<{ id: string }>, res: Response) {
  await deleteFixedPrice(req.params.id);
  res.json({ message: "Fixed price deleted" });
}

// DELETE /api/fixed-prices/all
export async function removeAllFixedPrices(req: Request, res: Response) {
  await deleteAllFixedPrices();
  res.json({ message: "All fixed prices deleted" });
}
