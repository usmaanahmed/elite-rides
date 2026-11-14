// Payment (Stripe) ke URLs. Login nahi: Stripe khud call karta hai, signature se pehchana jata hai
import express, { Router } from "express";
import { receiveStripeWebhook } from "./payment.controller.js";

const router = Router();

// Stripe signature sirf asli (raw) body par check hoti hai, isliye yahan JSON parse nahi karte
router.post("/stripe/webhook", express.raw({ type: "application/json" }), receiveStripeWebhook);

export default router;
