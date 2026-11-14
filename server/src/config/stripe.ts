// Stripe ka client. STRIPE_SECRET_KEY khaali ho to null (card payment band)
import Stripe from "stripe";
import { env } from "./env.js";

let stripeClient: Stripe | null = null;
if (env.stripeSecretKey !== "") {
  stripeClient = new Stripe(env.stripeSecretKey);
}

export const stripe = stripeClient;
