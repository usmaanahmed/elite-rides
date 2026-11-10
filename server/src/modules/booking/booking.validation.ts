// Booking ke input ko check karne wali Zod rules
import { z } from "zod";
import { quoteSchema } from "../quote/quote.validation.js";

export const createBookingSchema = z.object({
  // Journey ki details: quote ke saare rules yahan bhi lagte hain
  quote: quoteSchema,
  vehicleId: z.string().trim().min(1, "Choose a vehicle"),
  customer: z.object({
    name: z.string().trim().min(2, "Enter the passenger name").max(100),
    email: z.string().trim().toLowerCase().email("Enter a valid email address").max(200),
    phone: z.string().trim().min(6, "Enter a valid phone number").max(30),
    customerId: z.string().trim().default(""),
  }),
  luggage: z.coerce.number().int().min(0).max(99).default(0),
  flightNo: z.string().trim().max(30).default(""),
  arrivalFrom: z.string().trim().max(100).default(""),
  paymentMethod: z.enum(["pay_card", "pay_cash"]),
  notes: z.string().trim().max(1000).default(""),
});

export const bookingStatusSchema = z.object({
  status: z.enum(["pending", "confirmed", "completed", "cancelled"]),
});

export const waitingTimeSchema = z.object({
  minutes: z.coerce.number().int("Minutes must be a whole number").min(0).max(600, "Maximum 600 minutes"),
});

export const paymentUpdateSchema = z.object({
  paymentStatus: z.enum(["pending", "partially_paid", "paid"]),
  amountPaid: z.coerce.number().min(0).max(100000).default(0),
});

// URL ke query string se filters (?status=confirmed&page=2). Khaali ya missing = filter nahi
export const bookingListQuerySchema = z.object({
  search: z.string().trim().max(100).default(""),
  status: z.enum(["", "quote_requested", "pending", "confirmed", "completed", "cancelled"]).default(""),
  paymentStatus: z.enum(["", "pending", "partially_paid", "paid"]).default(""),
  dateFrom: z.union([z.string().regex(/^\d{4}-\d{2}-\d{2}$/), z.literal("")]).default(""),
  dateTo: z.union([z.string().regex(/^\d{4}-\d{2}-\d{2}$/), z.literal("")]).default(""),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(1000).default(50),
});
