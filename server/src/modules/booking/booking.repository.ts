// Booking ke database queries (sirf queries, koi business logic nahi)
import { Booking, BookingCounter } from "./booking.model.js";
import { NewBookingData } from "./booking.types.js";

// Booking number ka agla sequence number. $inc ek hi step me hota hai, isliye do bookings ko same number nahi milta
export async function getNextBookingSequence(): Promise<number> {
  const counter = await BookingCounter.findOneAndUpdate(
    { name: "booking" },
    { $inc: { seq: 1 } },
    { returnDocument: "after", upsert: true }
  ).lean();
  return counter ? counter.seq : 1;
}

export function createBooking(data: NewBookingData) {
  return Booking.create(data);
}

export function findBookingById(id: string) {
  return Booking.findById(id).lean();
}

// filter ek simple MongoDB filter object hai jo service banati hai
export function findBookings(filter: Record<string, unknown>, skip: number, limit: number) {
  return Booking.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean();
}

export function countBookings(filter: Record<string, unknown>) {
  return Booking.countDocuments(filter);
}

// Sirf diye hue fields badalta hai
export function updateBookingById(id: string, fieldsToChange: Record<string, unknown>) {
  return Booking.findByIdAndUpdate(id, { $set: fieldsToChange }, { returnDocument: "after" }).lean();
}

// Is vehicle ki kitni bookings abhi active hain (quote requested, pending ya confirmed)
export function countActiveBookingsByVehicle(vehicleId: string) {
  return Booking.countDocuments({
    vehicleId: vehicleId,
    status: { $in: ["quote_requested", "pending", "confirmed"] },
  });
}
