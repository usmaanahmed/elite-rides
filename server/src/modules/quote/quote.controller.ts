// Quote ke requests lo, service se kaam karwao, response bhejo
import { Request, Response } from "express";
import { createQuote } from "./quote.service.js";

// POST /api/quotes
export async function getQuote(req: Request, res: Response) {
  const quote = await createQuote(req.body);
  res.json(quote);
}
