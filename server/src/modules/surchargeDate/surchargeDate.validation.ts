// Surcharge on date ke input ko check karne wali Zod rules
import { z } from "zod";

const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;
// Time optional hai: ya to sahi "HH:mm" ya khaali
const optionalTime = z.string().regex(timeRegex, "Use time like 06:30").or(z.literal(""));

export const surchargeDateSchema = z
  .object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use date like 2026-12-25"),
    amountType: z.enum(["fixed", "percent"]),
    amount: z.coerce.number().gt(0, "Amount must be more than 0").max(1000, "Amount is too big"),
    fromTime: optionalTime,
    toTime: optionalTime,
    status: z.enum(["active", "inactive"]),
  })
  .refine((values) => (values.fromTime === "") === (values.toTime === ""), {
    message: "Enter both from time and to time, or leave both empty",
    path: ["toTime"],
  })
  .refine((values) => values.amountType !== "percent" || values.amount <= 100, {
    message: "Percent cannot be more than 100",
    path: ["amount"],
  })
  .refine((values) => values.fromTime === "" || values.fromTime !== values.toTime, {
    message: "To time must be different from the from time",
    path: ["toTime"],
  });
