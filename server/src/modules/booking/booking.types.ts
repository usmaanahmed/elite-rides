// Booking module ke TypeScript types
import { Types } from "mongoose";
import { QuoteExtras, QuoteInput, QuoteLine, TripType } from "../quote/quote.types.js";

export type BookingStatus = "quote_requested" | "pending" | "confirmed" | "completed" | "cancelled";
// pay_card = card se online, pay_cash = gaari me (pay in car)
export type PaymentMethod = "pay_card" | "pay_cash";
export type PaymentStatus = "pending" | "partially_paid" | "paid";

export interface BookingCustomer {
  name: string;
  email: string;
  phone: string;
  // Registered customer ki id (Phase 12). Guest booking me ""
  customerId: string;
}

// Booking banane ki request (validation ke baad)
export interface CreateBookingInput {
  // Journey ki details, bilkul quote wali
  quote: QuoteInput;
  // Kis vehicle ki booking hai (quote.vehicleId yahan se set hota hai)
  vehicleId: string;
  customer: BookingCustomer;
  luggage: number;
  flightNo: string;
  arrivalFrom: string;
  paymentMethod: PaymentMethod;
  notes: string;
}

// Booking jaisi database me save hoti hai
export interface BookingRecord {
  _id: Types.ObjectId;
  bookingNumber: string;
  status: BookingStatus;
  customer: BookingCustomer;
  tripType: TripType;
  pickup: string;
  via: string[];
  dropoff: string;
  pickupDate: string;
  pickupTime: string;
  returnDate: string;
  returnTime: string;
  hourlyDuration: number;
  passengers: number;
  luggage: number;
  vehicleId: string;
  vehicleName: string;
  extras: QuoteExtras;
  flightNo: string;
  arrivalFrom: string;
  distanceMiles: number;
  // Price breakdown ka snapshot: baad me rates badlen to bhi purani booking ki price nahi badalti
  priceLines: QuoteLine[];
  total: number;
  couponCode: string;
  couponDiscount: number;
  // true ho to coupon ka usedCount pehle hi barh chuka hai (dobara nahi barhta)
  couponUsageRecorded: boolean;
  waitingMinutes: number;
  waitingCharge: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  amountPaid: number;
  notes: string;
  createdAt: Date;
}

// Database me nayi booking save karne ka data
export type NewBookingData = Omit<BookingRecord, "_id" | "createdAt">;

// Booking jaisi frontend ko bheji jaati hai
export interface BookingResponse extends Omit<BookingRecord, "_id" | "createdAt" | "couponUsageRecorded"> {
  id: string;
  // total - amountPaid
  balanceDue: number;
  createdAt: string;
}

// Bookings list ke filters (sab optional, khaali string = filter nahi)
export interface BookingListQuery {
  search: string;
  status: string;
  paymentStatus: string;
  // Pickup date ki range "YYYY-MM-DD"
  dateFrom: string;
  dateTo: string;
  page: number;
  limit: number;
}

export interface BookingListResponse {
  items: BookingResponse[];
  total: number;
  page: number;
  limit: number;
}
