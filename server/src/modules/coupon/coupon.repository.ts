// Coupon ke database queries (sirf queries, koi business logic nahi)
import { Coupon } from "./coupon.model.js";
import { CouponInput } from "./coupon.types.js";

export function findAllCoupons() {
  return Coupon.find().sort({ createdAt: -1 }).lean();
}

export function findCouponById(id: string) {
  return Coupon.findById(id).lean();
}

export function findCouponByCode(code: string) {
  return Coupon.findOne({ code: code }).lean();
}

export function createCoupon(data: CouponInput) {
  return Coupon.create(data);
}

// usedCount aur totalDiscountGiven ko nahi chhedta, sirf form wale fields badalta hai
export function updateCouponById(id: string, data: CouponInput) {
  return Coupon.findByIdAndUpdate(id, data, { returnDocument: "after" }).lean();
}

// Coupon use hone par usedCount +1 aur discount ka total barhata hai
export function addCouponUsage(code: string, discountAmount: number) {
  return Coupon.findOneAndUpdate(
    { code: code },
    { $inc: { usedCount: 1, totalDiscountGiven: discountAmount } },
    { returnDocument: "after" }
  ).lean();
}
