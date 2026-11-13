// Surcharge address ke input ko check karne wali Zod rules
import { z } from "zod";

const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

export const surchargeAddressSchema = z
  .object({
    address: z.string().trim().min(1, "Enter the address").max(200, "Address must be 200 characters or fewer"),
    fromTime: z.string().regex(timeRegex, "Use time like 06:30"),
    toTime: z.string().regex(timeRegex, "Use time like 06:30"),
    price: z.coerce.number().min(0, "Price cannot be negative").max(1000, "Price cannot be more than £1000"),
    status: z.enum(["active", "inactive"]),
  })
  .refine((values) => values.fromTime !== values.toTime, {
    message: "To time must be different from the from time",
    path: ["toTime"],
  });
