// Tour ke input ko check karne wali Zod rules
import { z } from "zod";

// Form data me prices ek JSON text ke taur par aati hain, e.g. '[{"vehicleId":"abc","price":250}]'
function readPricesText(value: unknown): unknown {
  if (typeof value !== "string") {
    return value;
  }
  try {
    return JSON.parse(value);
  } catch {
    return "invalid";
  }
}

const priceSchema = z.object({
  vehicleId: z.string().trim().min(1, "Choose a vehicle"),
  price: z.coerce.number().positive("Price must be more than 0").max(100000, "Price is too high"),
});

const tourFields = {
  title: z.string().trim().min(2, "Tour title must be at least 2 characters").max(100, "Tour title must be 100 characters or fewer"),
  description: z.string().trim().max(2000, "Description must be 2000 characters or fewer").default(""),
  prices: z.preprocess(readPricesText, z.array(priceSchema).min(1, "Set a price for at least one vehicle")),
};

export const createTourSchema = z.object(tourFields);

// Edit me purani images ke file names bhi aa sakte hain jo hatani hain ("removedImages[]" field)
export const updateTourSchema = z.object({
  ...tourFields,
  removedImages: z.array(z.string()).default([]),
});
