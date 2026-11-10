// Coupon module ke TypeScript types
import { Types } from "mongoose";

export type CouponDiscountType = "percent" | "fixed";
export type CouponStatus = "active" | "inactive";

// Admin form se aane wali values
export interface CouponInput {
  // Uppercase letters + numbers, e.g. "SAVE10"
  code: string;
  // percent = fare ka %, fixed = pounds
  discountType: CouponDiscountType;
  discountValue: number;
  // "YYYY-MM-DD". Khaali ("") = kabhi expire nahi hota
  expiryDate: string;
  // 0 = unlimited
  usageLimit: number;
  status: CouponStatus;
}

export interface CouponRecord extends CouponInput {
  _id: Types.ObjectId;
  // Kitni bar use hua (booking confirm hone par barhta hai)
  usedCount: number;
  // Is coupon se ab tak kul kitna discount diya gaya (pounds)
  totalDiscountGiven: number;
}

export interface CouponResponse extends CouponInput {
  id: string;
  usedCount: number;
  totalDiscountGiven: number;
}

export interface CouponStatsResponse {
  totalCoupons: number;
  activeCoupons: number;
  totalUsage: number;
  totalDiscountGiven: number;
}
