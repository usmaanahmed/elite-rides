// Coupon ki business logic
import { isValidObjectId } from "mongoose";
import { AppError } from "../../utils/AppError.js";
import { roundMoney } from "../../utils/roundMoney.js";
import {
  addCouponUsage,
  createCoupon as saveCoupon,
  findAllCoupons,
  findCouponByCode,
  findCouponById,
  updateCouponById,
} from "./coupon.repository.js";
import { CouponInput, CouponRecord, CouponResponse, CouponStatsResponse } from "./coupon.types.js";

function toCouponResponse(record: CouponRecord): CouponResponse {
  return {
    id: record._id.toString(),
    code: record.code,
    discountType: record.discountType,
    discountValue: record.discountValue,
    expiryDate: record.expiryDate,
    usageLimit: record.usageLimit,
    status: record.status,
    usedCount: record.usedCount,
    totalDiscountGiven: record.totalDiscountGiven,
  };
}

async function checkCodeIsFree(code: string, ownId?: string) {
  const existing = await findCouponByCode(code);
  if (existing && existing._id.toString() !== ownId) {
    throw new AppError("code: This coupon code already exists", 409);
  }
}

export async function getAllCoupons(): Promise<CouponResponse[]> {
  const records = await findAllCoupons();
  return records.map((record) => toCouponResponse(record as unknown as CouponRecord));
}

// Coupons page ke 4 stat cards
export async function getCouponStats(): Promise<CouponStatsResponse> {
  const records = await findAllCoupons();

  let activeCoupons = 0;
  let totalUsage = 0;
  let totalDiscountGiven = 0;
  for (const record of records) {
    if (record.status === "active") {
      activeCoupons = activeCoupons + 1;
    }
    totalUsage = totalUsage + record.usedCount;
    totalDiscountGiven = totalDiscountGiven + record.totalDiscountGiven;
  }

  return {
    totalCoupons: records.length,
    activeCoupons: activeCoupons,
    totalUsage: totalUsage,
    totalDiscountGiven: roundMoney(totalDiscountGiven),
  };
}

export async function createCoupon(input: CouponInput): Promise<CouponResponse> {
  await checkCodeIsFree(input.code);

  const record = await saveCoupon(input);
  return toCouponResponse(record.toObject() as unknown as CouponRecord);
}

export async function updateCoupon(id: string, input: CouponInput): Promise<CouponResponse> {
  if (!isValidObjectId(id)) {
    throw new AppError("Coupon not found", 404);
  }

  const existing = await findCouponById(id);
  if (!existing) {
    throw new AppError("Coupon not found", 404);
  }
  await checkCodeIsFree(input.code, id);

  const updated = await updateCouponById(id, input);
  if (!updated) {
    throw new AppError("Coupon not found", 404);
  }
  return toCouponResponse(updated as unknown as CouponRecord);
}

// Fare engine (Phase 8) ke liye: coupon sahi hai to wapas karta hai, warna customer ke liye error.
// Valid tab hai jab: status Active + expiry nahi guzri + usedCount < usageLimit (0 = unlimited)
// pickupDate "YYYY-MM-DD" hai: coupon us trip ki date tak valid hona chahiye
export async function validateCoupon(code: string, pickupDate: string): Promise<CouponResponse> {
  const cleanedCode = code.trim().toUpperCase();
  const record = await findCouponByCode(cleanedCode);

  if (!record || record.status !== "active") {
    throw new AppError("This coupon code is not valid", 400);
  }
  // "YYYY-MM-DD" strings seedhe compare ho sakti hain
  if (record.expiryDate !== "" && record.expiryDate < pickupDate) {
    throw new AppError("This coupon has expired", 400);
  }
  if (record.usageLimit > 0 && record.usedCount >= record.usageLimit) {
    throw new AppError("This coupon has reached its usage limit", 400);
  }

  return toCouponResponse(record as unknown as CouponRecord);
}

// Fare engine ke liye: is coupon se amount par kitna discount milega (total se zyada kabhi nahi)
export function calculateCouponDiscount(coupon: CouponResponse, amount: number): number {
  let discount = coupon.discountValue;
  if (coupon.discountType === "percent") {
    discount = (amount * coupon.discountValue) / 100;
  }

  discount = roundMoney(discount);
  if (discount > amount) {
    return roundMoney(amount);
  }
  return discount;
}

// Booking confirm hone par (Phase 9) bulao: usedCount +1 aur diya gaya discount record karo
export async function recordCouponUsage(code: string, discountAmount: number): Promise<void> {
  await addCouponUsage(code.trim().toUpperCase(), discountAmount);
}
