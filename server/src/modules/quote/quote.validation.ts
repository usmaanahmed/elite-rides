// Quote request ko check karne wali Zod rules
import { z } from "zod";

const dateText = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use date like 2026-12-25");
const timeText = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Use time like 06:30");

const extrasSchema = z.object({
  babySeats: z.coerce.number().int().min(0).max(10),
  boosterSeats: z.coerce.number().int().min(0).max(10),
  meetAndGreet: z.boolean(),
  extraLuggage: z.coerce.number().int().min(0).max(50),
  specialLuggage: z.coerce.number().int().min(0).max(50),
  wheelchair: z.boolean(),
});

const noExtras = {
  babySeats: 0,
  boosterSeats: 0,
  meetAndGreet: false,
  extraLuggage: 0,
  specialLuggage: 0,
  wheelchair: false,
};

export const quoteSchema = z
  .object({
    tripType: z.enum(["one_way", "return", "hourly"]),
    pickup: z.string().trim().min(3, "Enter the pickup address").max(300),
    via: z.array(z.string().trim().min(3).max(300)).max(5, "Maximum 5 via stops").default([]),
    dropoff: z.string().trim().max(300).default(""),
    pickupDate: dateText,
    pickupTime: timeText,
    returnDate: z.union([dateText, z.literal("")]).default(""),
    returnTime: z.union([timeText, z.literal("")]).default(""),
    hourlyDuration: z.coerce.number().min(0).max(24).default(0),
    passengers: z.coerce.number().int().min(1, "At least 1 passenger").max(99),
    extras: extrasSchema.default(noExtras),
    couponCode: z.string().trim().toUpperCase().max(20).default(""),
    vehicleId: z.string().trim().default(""),
  })
  .refine((values) => values.tripType === "hourly" || values.dropoff.length >= 3, {
    message: "Enter the dropoff address",
    path: ["dropoff"],
  })
  .refine((values) => values.tripType !== "hourly" || values.hourlyDuration > 0, {
    message: "Enter the hire duration in hours",
    path: ["hourlyDuration"],
  })
  .refine((values) => values.tripType !== "return" || (values.returnDate !== "" && values.returnTime !== ""), {
    message: "Enter the return date and time",
    path: ["returnDate"],
  });
