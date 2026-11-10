// Congestion address ke input ko check karne wali Zod rules
import { z } from "zod";

export const congestionAddressSchema = z.object({
  postcode: z
    .string()
    .trim()
    .min(2, "Postcode must be at least 2 characters")
    .max(10, "Postcode must be 10 characters or fewer")
    .regex(/^[A-Za-z0-9 ]+$/, "Postcode can only have letters and numbers"),
  price: z.coerce.number().min(0, "Price cannot be negative").max(1000, "Price cannot be more than £1000"),
});
