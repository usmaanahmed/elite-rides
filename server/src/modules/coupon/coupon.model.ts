// Coupon ka database structure (Mongoose schema)
import { model, Schema } from "mongoose";

const couponSchema = new Schema(
  {
    // Uppercase me save hota hai, e.g. "SAVE10"
    code: { type: String, required: true, trim: true, uppercase: true, unique: true },
    discountType: { type: String, enum: ["percent", "fixed"], required: true },
    discountValue: { type: Number, required: true },
    expiryDate: { type: String, default: "" },
    usageLimit: { type: Number, default: 0 },
    usedCount: { type: Number, default: 0 },
    totalDiscountGiven: { type: Number, default: 0 },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

export const Coupon = model("Coupon", couponSchema);
