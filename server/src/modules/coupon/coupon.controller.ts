// Coupon ke requests lo, service se kaam karwao, response bhejo
import { Request, Response } from "express";
import { createCoupon, getAllCoupons, getCouponStats, updateCoupon } from "./coupon.service.js";

// GET /api/coupons
export async function getCoupons(req: Request, res: Response) {
  const coupons = await getAllCoupons();
  res.json(coupons);
}

// GET /api/coupons/stats
export async function readCouponStats(req: Request, res: Response) {
  const stats = await getCouponStats();
  res.json(stats);
}

// POST /api/coupons
export async function addCoupon(req: Request, res: Response) {
  const coupon = await createCoupon(req.body);
  res.status(201).json(coupon);
}

// PUT /api/coupons/:id
export async function editCoupon(req: Request<{ id: string }>, res: Response) {
  const coupon = await updateCoupon(req.params.id, req.body);
  res.json(coupon);
}
