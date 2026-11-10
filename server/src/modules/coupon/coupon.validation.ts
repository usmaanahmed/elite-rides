// Coupon ke input ko check karne wali Zod rules
import { z } from "zod";

export const couponSchema = z
  .object({
    // Chhote letters likhe hon to bhi uppercase me badal dete hain
    code: z
      .string()
      .trim()
      .toUpperCase()
      .min(3, "Code must be at least 3 characters")
      .max(20, "Code must be 20 characters or fewer")
      .regex(/^[A-Z0-9]+$/, "Code can only have letters and numbers"),
    discountType: z.enum(["percent", "fixed"]),
    discountValue: z.coerce.number().gt(0, "Discount must be more than 0").max(1000, "Discount is too big"),
    // Khaali = kabhi expire nahi hota
    expiryDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use date like 2026-12-31").or(z.literal("")),
    // 0 = unlimited
    usageLimit: z.coerce.number().int("Usage limit must be a whole number").min(0, "Usage limit cannot be negative").max(1000000),
    status: z.enum(["active", "inactive"]),
  })
  .refine((values) => values.discountType !== "percent" || values.discountValue <= 100, {
    message: "Percent cannot be more than 100",
    path: ["discountValue"],
  });
