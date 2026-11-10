// Night surcharge ke input ko check karne wali Zod rules
import { z } from "zod";

const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

export const surchargeNightSchema = z
  .object({
    startTime: z.string().regex(timeRegex, "Use time like 22:00"),
    endTime: z.string().regex(timeRegex, "Use time like 06:00"),
    amountType: z.enum(["fixed", "percent"]),
    amount: z.coerce.number().min(0, "Amount cannot be negative").max(1000, "Amount is too big"),
    status: z.enum(["active", "inactive"]),
  })
  .refine((values) => values.startTime !== values.endTime, {
    message: "End time must be different from the start time",
    path: ["endTime"],
  })
  .refine((values) => values.amountType !== "percent" || values.amount <= 100, {
    message: "Percent cannot be more than 100",
    path: ["amount"],
  });
