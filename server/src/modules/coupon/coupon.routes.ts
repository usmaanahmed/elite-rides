// Coupon module ke URLs
import { Router } from "express";
import { validate } from "../../middlewares/validate.js";
import { addCoupon, editCoupon, getCoupons, readCouponStats } from "./coupon.controller.js";
import { couponSchema } from "./coupon.validation.js";

const router = Router();

router.get("/", getCoupons);
router.get("/stats", readCouponStats);
router.post("/", validate(couponSchema), addCoupon);
router.put("/:id", validate(couponSchema), editCoupon);

export default router;
