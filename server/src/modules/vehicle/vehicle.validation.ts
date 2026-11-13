// Vehicle ke input ko check karne wali Zod rules
import { z } from "zod";

// Form data me sab kuch text aata hai, coerce usay number bana deta hai
const passengerCapacity = z.coerce.number().int().min(1).max(99);
const luggageCapacity = z.coerce.number().int().min(0).max(50);
const percentage = z.coerce.number().min(0).max(100);
const displayOrder = z.coerce.number().int().min(1).max(999);

const vehicleFields = {
  name: z.string().trim().min(2, "Car name must be at least 2 characters").max(50, "Car name must be 50 characters or fewer"),
  description: z.string().trim().max(500, "Description must be 500 characters or fewer").default(""),
  passengerCapacity: passengerCapacity,
  luggageCapacity: luggageCapacity,
  handLuggageCapacity: luggageCapacity,
  discountRate: percentage,
  returnDiscountRate: percentage,
};

export const createVehicleSchema = z.object(vehicleFields);

// Edit form me display order bhi badla ja sakta hai, image dena optional hai
export const updateVehicleSchema = z.object({
  ...vehicleFields,
  displayOrder: displayOrder,
});

// Ek mileage band: "£ Rates" modal JSON bhejta hai, is liye coerce ki zaroorat nahi
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

// "£ Rates" modal: mileage ya slab bands, fixed price aur hourly rate ek saath save hote hain
// Bands khaali ho sakte hain (jab Settings me "Single price" on ho to vehicle ke apne bands use nahi hote)
export const updateRatesSchema = z.object({
  rateType: z.enum(["mileage", "slab"]),
  fixedPrice: z.number().min(0),
  hourlyRate: z.number().min(0),
  mileageBands: z.array(mileageBandSchema).default([]),
  slabBands: z.array(slabBandSchema).default([]),
});

// "Add Calculation Format" modal: har vehicle ki value + Price/% ek saath save hoti hai
export const updateCalculationFormatSchema = z.object({
  items: z
    .array(
      z.object({
        vehicleId: z.string().min(1),
        type: z.enum(["percent", "fixed"]),
        value: z.number().min(0),
      })
    )
    .min(1),
});
