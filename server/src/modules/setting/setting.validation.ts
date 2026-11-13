// Settings ke input ko check karne wali Zod rules
import { z } from "zod";

const MAX_PRICE = 10000;

// Paisa: 0 se MAX_PRICE tak
const priceField = z.coerce.number().min(0, "Cannot be negative").max(MAX_PRICE, "Cannot be more than £" + MAX_PRICE);

// Khaali string ya sahi date (YYYY-MM-DD)
const optionalDate = z.string().trim().regex(/^(\d{4}-\d{2}-\d{2})?$/, "Use a valid date");

// Khaali string ya sahi time (HH:MM)
const optionalTime = z.string().trim().regex(/^([01]\d|2[0-3]):[0-5]\d$|^$/, "Use a valid time like 02:00");

// Khaali string ya sahi website URL
const optionalUrl = z.string().trim().max(500, "Link is too long").refine(isEmptyOrUrl, "Enter a full link starting with https://");

function isEmptyOrUrl(value: string): boolean {
  if (value === "") return true;
  return URL.canParse(value) && (value.startsWith("http://") || value.startsWith("https://"));
}

const discountType = z.enum(["none", "fixed", "percent"]);

const officeSchema = z.object({
  companyName: z.string().trim().min(1, "Enter the company name").max(100),
  appName: z.string().trim().min(1, "Enter the app name").max(100),
  currency: z.string().trim().min(1, "Enter the currency symbol").max(5),
  companyEmail: z.string().trim().toLowerCase().pipe(z.email("Enter a valid email")),
  fromEmail: z.string().trim().toLowerCase().pipe(z.email("Enter a valid email")),
  siteUrl: optionalUrl,
});

const mileageBandSchema = z.object({
  fromMiles: z.number().min(1),
  toMiles: z.number().min(1),
  ratePerMile: z.number().positive(),
});

const slabBandSchema = z.object({
  fromMiles: z.number().min(1),
  toMiles: z.number().min(1),
  price: z.number().positive(),
});

const singleRatesSchema = z.object({
  fixedPrice: priceField,
  mileageBands: z.array(mileageBandSchema).default([]),
  slabBands: z.array(slabBandSchema).default([]),
});

// Single price mode me active band type (slab ya mileage) ke kam az kam ek band zaroori hai
const pricingSchema = z
  .object({
    mileageBySlabs: z.boolean(),
    roundOff: z.boolean(),
    setPrice: z.enum(["per_vehicle", "single_price"]),
    showCard: z.boolean(),
    singleRates: singleRatesSchema,
  })
  .refine(
    (pricing) => {
      if (pricing.setPrice !== "single_price") return true;
      if (pricing.mileageBySlabs) return pricing.singleRates.slabBands.length > 0;
      return pricing.singleRates.mileageBands.length > 0;
    },
    { message: "Add at least one band for the single price rates", path: ["singleRates"] }
  );

const extrasSchema = z.object({
  babySeatPrice: priceField,
  boosterSeatPrice: priceField,
  meetAndGreetPrice: priceField,
  luggagePrice: priceField,
  specialLuggagePrice: priceField,
  wheelchairPrice: priceField,
  petPrice: priceField,
  returnExtraPrice: priceField,
  waitingPricePer5Minutes: priceField,
  viaPrice: priceField,
});

const generalSchema = z
  .object({
    guestLogin: z.boolean(),
    hourlyRateStatus: z.boolean(),
    isQuotation: z.boolean(),
    graceTimeMinutes: z.coerce.number().int("Must be a whole number").min(0).max(1440),
    maxPassengers: z.coerce.number().int("Must be a whole number").min(1).max(100),
    bookingNumberPrefix: z
      .string()
      .trim()
      .toUpperCase()
      .regex(/^[A-Z0-9]{1,10}$/, "Use 1 to 10 letters or numbers"),
    blockDateFrom: optionalDate,
    blockDateTo: optionalDate,
    blockTimeFrom: optionalTime,
    blockTimeTo: optionalTime,
    bookingSuccessRedirectUrl: optionalUrl,
  })
  .refine((general) => (general.blockDateFrom === "") === (general.blockDateTo === ""), {
    message: "Fill both block dates, or leave both empty",
    path: ["blockDateTo"],
  })
  .refine((general) => general.blockDateFrom === "" || general.blockDateFrom <= general.blockDateTo, {
    message: "End date must be on or after the start date",
    path: ["blockDateTo"],
  })
  .refine((general) => (general.blockTimeFrom === "") === (general.blockTimeTo === ""), {
    message: "Fill both block times, or leave both empty",
    path: ["blockTimeTo"],
  });

const discountSchema = z
  .object({
    globalDiscountType: discountType,
    globalDiscountValue: z.coerce.number().min(0, "Cannot be negative"),
    pretendDiscountType: discountType,
    pretendDiscountValue: z.coerce.number().min(0, "Cannot be negative"),
  })
  .refine((discount) => discount.globalDiscountType !== "percent" || discount.globalDiscountValue <= 100, {
    message: "A percentage cannot be more than 100",
    path: ["globalDiscountValue"],
  })
  .refine((discount) => discount.pretendDiscountType !== "percent" || discount.pretendDiscountValue <= 100, {
    message: "A percentage cannot be more than 100",
    path: ["pretendDiscountValue"],
  })
  .refine((discount) => discount.globalDiscountType === "none" || discount.globalDiscountValue > 0, {
    message: "Enter the discount amount",
    path: ["globalDiscountValue"],
  })
  .refine((discount) => discount.pretendDiscountType === "none" || discount.pretendDiscountValue > 0, {
    message: "Enter the discount amount",
    path: ["pretendDiscountValue"],
  });

export const settingsSchema = z.object({
  office: officeSchema,
  pricing: pricingSchema,
  extras: extrasSchema,
  general: generalSchema,
  discount: discountSchema,
});
