// Drop down address ke input ko check karne wali Zod rules
import { z } from "zod";

const MAX_CHARGE = 1000;

// Pounds me charge, 0 se 1000 tak
const charge = z.coerce.number().min(0, "Charge cannot be negative").max(MAX_CHARGE, "Charge cannot be more than £" + MAX_CHARGE);

export const dropdownAddressSchema = z.object({
  address: z.string().trim().min(3, "Address must be at least 3 characters").max(200, "Address must be 200 characters or fewer"),
  comparableValue: z
    .string()
    .trim()
    .min(1, "Enter the comparable value")
    .max(100, "Comparable value must be 100 characters or fewer"),
  pickupCharge: charge,
  dropoffCharge: charge,
  type: z.enum(["address", "airport", "station"]),
});

// CSV import: frontend file parse karke rows bhejta hai. Har row ko service alag check karti hai,
// is liye yahan sirf itna check hota hai ke rows ka array aaya hai
export const importDropdownAddressesSchema = z.object({
  rows: z.array(z.record(z.string(), z.unknown())).min(1, "The file has no rows"),
});
