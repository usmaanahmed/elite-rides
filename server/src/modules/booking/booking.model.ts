// Booking aur booking-number counter ka database structure (Mongoose schemas)
import { model, Schema } from "mongoose";

const priceLineSchema = new Schema(
  {
    label: { type: String, required: true },
    amount: { type: Number, required: true },
  },
  { _id: false }
);

const bookingSchema = new Schema(
  {
    bookingNumber: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ["quote_requested", "pending", "confirmed", "completed", "cancelled"],
      required: true,
    },
    customer: {
      name: { type: String, required: true, trim: true },
      email: { type: String, required: true, trim: true, lowercase: true },
      phone: { type: String, required: true, trim: true },
      customerId: { type: String, default: "" },
    },
    tripType: { type: String, enum: ["one_way", "return", "hourly"], required: true },
    pickup: { type: String, required: true },
    via: { type: [String], default: [] },
    dropoff: { type: String, default: "" },
    // "YYYY-MM-DD" aur "HH:mm" text me, taake timezone ka masla na ho
    pickupDate: { type: String, required: true },
    pickupTime: { type: String, required: true },
    returnDate: { type: String, default: "" },
    returnTime: { type: String, default: "" },
    hourlyDuration: { type: Number, default: 0 },
    passengers: { type: Number, required: true },
    luggage: { type: Number, default: 0 },
    vehicleId: { type: String, required: true },
    vehicleName: { type: String, required: true },
    extras: {
      babySeats: { type: Number, default: 0 },
      boosterSeats: { type: Number, default: 0 },
      meetAndGreet: { type: Boolean, default: false },
      extraLuggage: { type: Number, default: 0 },
      specialLuggage: { type: Number, default: 0 },
      wheelchair: { type: Boolean, default: false },
      pet: { type: Boolean, default: false },
    },
    flightNo: { type: String, default: "" },
    arrivalFrom: { type: String, default: "" },
    distanceMiles: { type: Number, default: 0 },
    priceLines: { type: [priceLineSchema], default: [] },
    total: { type: Number, required: true },
    couponCode: { type: String, default: "" },
    couponDiscount: { type: Number, default: 0 },
    couponUsageRecorded: { type: Boolean, default: false },
    waitingMinutes: { type: Number, default: 0 },
    waitingCharge: { type: Number, default: 0 },
    paymentMethod: { type: String, enum: ["pay_card", "pay_cash"], required: true },
    paymentStatus: { type: String, enum: ["pending", "partially_paid", "paid"], default: "pending" },
    amountPaid: { type: Number, default: 0 },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Booking = model("Booking", bookingSchema);

// Booking number ke liye counter. Ek hi document ("booking") jis ka seq har booking par +1 hota hai
const counterSchema = new Schema({
  name: { type: String, required: true, unique: true },
  seq: { type: Number, default: 0 },
});

export const BookingCounter = model("BookingCounter", counterSchema);
