// Fixed price ke input ko check karne wali Zod rules
import { z } from "zod";

const MAX_FARE = 10000;

const fare = z.coerce.number().min(0.01, "Fare must be more than £0").max(MAX_FARE, `Fare cannot be more than £${MAX_FARE}`);
const pickupPostcode = z.string().trim().min(1, "Enter the pickup postcode").max(10, "Pickup postcode must be 10 characters or fewer");
const dropCode = z.string().trim().min(1, "Enter the drop code").max(50, "Drop code must be 50 characters or fewer");

// Edit form: ek hi row
export const fixedPriceSchema = z.object({
  pickupPostcode: pickupPostcode,
  dropCode: dropCode,
  vehicleId: z.string().min(1, "Choose a vehicle"),
  fare: fare,
});

// Add form: ek route, ek ya zyada vehicles ka fare
export const createFixedPriceSchema = z.object({
  pickupPostcode: pickupPostcode,
  dropCode: dropCode,
  prices: z
    .array(z.object({ vehicleId: z.string().min(1), fare: fare }))
    .min(1, "Enter a price for at least one vehicle"),
});

// CSV import: columns `pickup,drop_code,fare,vehicle` (vehicle = naam, id nahi)
export const importFixedPricesRowSchema = z.object({
  pickup: pickupPostcode,
  drop_code: dropCode,
  vehicle: z.string().trim().min(1, "Enter the vehicle name"),
  fare: fare,
});

// CSV import: frontend file parse karke rows bhejta hai. Har row ko service alag check karti hai,
// is liye yahan sirf itna check hota hai ke rows ka array aaya hai
export const importFixedPricesSchema = z.object({
  rows: z.array(z.record(z.string(), z.unknown())).min(1, "The file has no rows"),
});
