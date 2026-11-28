// FAQ ke requests lo, service se kaam karwao, response bhejo
import { Request, Response } from "express";
import { createFaq, deleteFaq, getAllFaqs, updateFaq } from "./faq.service.js";

// GET /api/faqs
export async function getFaqs(req: Request, res: Response) {
  const faqs = await getAllFaqs();
  res.json(faqs);
}

// POST /api/faqs
export async function addFaq(req: Request, res: Response) {
  const faq = await createFaq(req.body);
  res.status(201).json(faq);
}

// PUT /api/faqs/:id
export async function editFaq(req: Request<{ id: string }>, res: Response) {
  const faq = await updateFaq(req.params.id, req.body);
  res.json(faq);
}

// DELETE /api/faqs/:id
export async function removeFaq(req: Request<{ id: string }>, res: Response) {
  await deleteFaq(req.params.id);
  res.json({ message: "FAQ deleted" });
}
