// Stripe ke requests lo, service se kaam karwao, response bhejo
import { Request, Response } from "express";
import { AppError } from "../../utils/AppError.js";
import { handleStripeWebhook } from "./payment.service.js";

// POST /api/payments/stripe/webhook (body raw Buffer hai, JSON nahi, taake signature check ho sake)
export async function receiveStripeWebhook(req: Request, res: Response) {
  const signature = req.headers["stripe-signature"];
  if (typeof signature !== "string") {
    throw new AppError("Missing Stripe signature", 400);
  }

  await handleStripeWebhook(req.body as Buffer, signature);
  res.json({ received: true });
}
