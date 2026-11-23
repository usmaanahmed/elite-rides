// Tour ke input ko check karne wali Zod rules
import { z } from "zod";

// Form data me prices aur itinerary JSON text ke taur par aati hain, e.g. '[{"vehicleId":"abc","price":250}]'
function readJsonText(value: unknown): unknown {
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

const placeSchema = z.object({
  name: z.string().trim().min(1, "Enter the place name").max(200, "Place name must be 200 characters or fewer"),
  address: z.string().trim().max(300, "Place address is too long").default(""),
  // Jagah Google Maps se chuni jaati hai, is liye map ki position zaroori hai
  lat: z.number({ message: "Pick the place from the Google list" }).min(-90).max(90),
  lng: z.number({ message: "Pick the place from the Google list" }).min(-180).max(180),
  description: z.string().trim().max(500, "Place description must be 500 characters or fewer").default(""),
});

const itineraryDaySchema = z.object({
  title: z.string().trim().max(100, "Day title must be 100 characters or fewer").default(""),
  places: z.array(placeSchema).min(1, "Add at least one place to each day").max(20, "A day can have up to 20 places"),
});

// Date "YYYY-MM-DD" ho ya khali ("" = date set nahi)
const optionalDateSchema = z
  .string()
  .trim()
  .refine((value) => value === "" || /^\d{4}-\d{2}-\d{2}$/.test(value), "Enter a valid date")
  .default("");

const tourFields = {
  title: z.string().trim().min(2, "Tour title must be at least 2 characters").max(100, "Tour title must be 100 characters or fewer"),
  description: z.string().trim().max(2000, "Description must be 2000 characters or fewer").default(""),
  startDate: optionalDateSchema,
  endDate: optionalDateSchema,
  durationDays: z.coerce.number().int("Duration must be a whole number").min(1, "Duration must be at least 1 day").max(365, "Duration is too long"),
  itinerary: z.preprocess(readJsonText, z.array(itineraryDaySchema).max(365, "Too many days")).default([]),
  prices: z.preprocess(readJsonText, z.array(priceSchema).min(1, "Set a price for at least one vehicle")),
};

// End date, start date se pehle nahi ho sakti
function checkDates(values: { startDate: string; endDate: string }, context: z.RefinementCtx): void {
  if (values.startDate !== "" && values.endDate !== "" && values.endDate < values.startDate) {
    context.addIssue({ code: "custom", path: ["endDate"], message: "End date can't be before the start date" });
  }
}

export const createTourSchema = z.object(tourFields).superRefine(checkDates);

// Edit me purani images ke file names bhi aa sakte hain jo hatani hain ("removedImages[]" field)
export const updateTourSchema = z
  .object({
    ...tourFields,
    removedImages: z.array(z.string()).default([]),
  })
  .superRefine(checkDates);
