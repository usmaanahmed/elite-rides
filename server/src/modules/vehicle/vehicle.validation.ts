// Vehicle ke input ko check karne wali Zod rules
import { z } from "zod";

// Form data me sab kuch text aata hai, coerce usay number bana deta hai
const passengerCapacity = z.coerce.number().int().min(1).max(99);
const luggageCapacity = z.coerce.number().int().min(0).max(50);
const percentage = z.coerce.number().min(0).max(100);

export const createVehicleSchema = z.object({
  name: z.string().trim().min(2, "Car name must be at least 2 characters").max(50, "Car name must be 50 characters or fewer"),
  description: z.string().trim().max(500, "Description must be 500 characters or fewer").default(""),
  passengerCapacity: passengerCapacity,
  luggageCapacity: luggageCapacity,
  handLuggageCapacity: luggageCapacity,
  discountRate: percentage,
  returnDiscountRate: percentage,
});
