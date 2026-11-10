// Booking ki business logic
import { isValidObjectId } from "mongoose";
import { AppError } from "../../utils/AppError.js";
import { roundMoney } from "../../utils/roundMoney.js";
import { recordCouponUsage } from "../coupon/coupon.service.js";
import { createQuote } from "../quote/quote.service.js";
import { getSettings } from "../setting/setting.service.js";
import {
  countBookings,
  createBooking as saveBooking,
  findBookingById,
  findBookings,
  getNextBookingSequence,
  updateBookingById,
} from "./booking.repository.js";
import {
  BookingListQuery,
  BookingListResponse,
  BookingRecord,
  BookingResponse,
  BookingStatus,
  CreateBookingInput,
  NewBookingData,
  PaymentStatus,
} from "./booking.types.js";

// Status kahan se kahan ja sakta hai. Completed aur cancelled booking aage nahi badalti
const ALLOWED_STATUS_CHANGES: Record<BookingStatus, BookingStatus[]> = {
  quote_requested: ["confirmed", "cancelled"],
  pending: ["confirmed", "cancelled"],
  confirmed: ["completed", "cancelled"],
  completed: [],
  cancelled: [],
};

const WAITING_LINE_LABEL = "Waiting time";

// Database wali booking ko frontend ke format me badalta hai
function toBookingResponse(record: BookingRecord): BookingResponse {
  return {
    id: record._id.toString(),
    bookingNumber: record.bookingNumber,
    status: record.status,
    customer: record.customer,
    tripType: record.tripType,
    pickup: record.pickup,
    via: record.via,
    dropoff: record.dropoff,
    pickupDate: record.pickupDate,
    pickupTime: record.pickupTime,
    returnDate: record.returnDate,
    returnTime: record.returnTime,
    hourlyDuration: record.hourlyDuration,
    passengers: record.passengers,
    luggage: record.luggage,
    vehicleId: record.vehicleId,
    vehicleName: record.vehicleName,
    extras: record.extras,
    flightNo: record.flightNo,
    arrivalFrom: record.arrivalFrom,
    distanceMiles: record.distanceMiles,
    priceLines: record.priceLines,
    total: record.total,
    couponCode: record.couponCode,
    couponDiscount: record.couponDiscount,
    waitingMinutes: record.waitingMinutes,
    waitingCharge: record.waitingCharge,
    paymentMethod: record.paymentMethod,
    paymentStatus: record.paymentStatus,
    amountPaid: record.amountPaid,
    balanceDue: roundMoney(record.total - record.amountPaid),
    notes: record.notes,
    createdAt: record.createdAt.toISOString(),
  };
}

// id sahi hai aur booking mojood hai to wapas karta hai, warna 404
async function getBookingRecordOrFail(id: string): Promise<BookingRecord> {
  if (!isValidObjectId(id)) {
    throw new AppError("Booking not found", 404);
  }
  const record = await findBookingById(id);
  if (!record) {
    throw new AppError("Booking not found", 404);
  }
  return record as unknown as BookingRecord;
}

// "ELR" + 6 digit number, e.g. "ELR000042"
function makeBookingNumber(prefix: string, sequence: number): string {
  return prefix + String(sequence).padStart(6, "0");
}

// Search text me regex ke khaas characters ko normal text bana deta hai
function escapeRegexText(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Booking confirm hone par coupon ka usedCount +1 (sirf ek baar)
async function recordCouponUsageOnce(booking: BookingRecord): Promise<boolean> {
  if (booking.couponCode === "" || booking.couponUsageRecorded) {
    return booking.couponUsageRecorded;
  }
  await recordCouponUsage(booking.couponCode, booking.couponDiscount);
  return true;
}

// ---------- Create ----------

// Booking banata hai. Price frontend se nahi aati: server dobara quote nikalta hai
export async function createBooking(input: CreateBookingInput): Promise<BookingResponse> {
  const quote = await createQuote({ ...input.quote, vehicleId: input.vehicleId });
  const vehicleQuote = quote.vehicles[0];
  if (!vehicleQuote.available) {
    throw new AppError(vehicleQuote.unavailableReason, 400);
  }

  const settings = await getSettings();

  // "Is Quotation" on ho to booking sirf quote request hai, admin approve karega.
  // Warna: gaari me payment = foran confirmed, card = payment aane tak pending
  let status: BookingStatus = "pending";
  if (settings.general.isQuotation) {
    status = "quote_requested";
  } else if (input.paymentMethod === "pay_cash") {
    status = "confirmed";
  }

  const sequence = await getNextBookingSequence();
  const bookingNumber = makeBookingNumber(settings.general.bookingNumberPrefix, sequence);

  const newBooking: NewBookingData = {
    bookingNumber: bookingNumber,
    status: status,
    customer: input.customer,
    tripType: input.quote.tripType,
    pickup: input.quote.pickup,
    via: input.quote.via,
    dropoff: input.quote.dropoff,
    pickupDate: input.quote.pickupDate,
    pickupTime: input.quote.pickupTime,
    returnDate: input.quote.returnDate,
    returnTime: input.quote.returnTime,
    hourlyDuration: input.quote.hourlyDuration,
    passengers: input.quote.passengers,
    luggage: input.luggage,
    vehicleId: vehicleQuote.vehicleId,
    vehicleName: vehicleQuote.vehicleName,
    extras: input.quote.extras,
    flightNo: input.flightNo,
    arrivalFrom: input.arrivalFrom,
    distanceMiles: quote.distanceMiles,
    // Price ka snapshot: ab rates badlen to is booking ki price nahi badlegi
    priceLines: vehicleQuote.lines,
    total: vehicleQuote.total,
    couponCode: input.quote.couponCode,
    couponDiscount: vehicleQuote.couponDiscount,
    couponUsageRecorded: false,
    waitingMinutes: 0,
    waitingCharge: 0,
    paymentMethod: input.paymentMethod,
    paymentStatus: "pending",
    amountPaid: 0,
    notes: input.notes,
  };

  const created = await saveBooking(newBooking);
  let record = created.toObject() as unknown as BookingRecord;

  // Foran confirmed booking par coupon use ho gaya
  if (record.status === "confirmed") {
    const wasRecorded = await recordCouponUsageOnce(record);
    if (wasRecorded) {
      await updateBookingById(record._id.toString(), { couponUsageRecorded: true });
      record = { ...record, couponUsageRecorded: true };
    }
  }

  return toBookingResponse(record);
}

// ---------- Read ----------

export async function getBookingList(query: BookingListQuery): Promise<BookingListResponse> {
  const filter: Record<string, unknown> = {};

  if (query.status !== "") {
    filter.status = query.status;
  }
  if (query.paymentStatus !== "") {
    filter.paymentStatus = query.paymentStatus;
  }
  if (query.dateFrom !== "" || query.dateTo !== "") {
    const dateRange: Record<string, string> = {};
    if (query.dateFrom !== "") {
      dateRange.$gte = query.dateFrom;
    }
    if (query.dateTo !== "") {
      dateRange.$lte = query.dateTo;
    }
    filter.pickupDate = dateRange;
  }
  if (query.search !== "") {
    const pattern = new RegExp(escapeRegexText(query.search), "i");
    filter.$or = [
      { bookingNumber: pattern },
      { "customer.name": pattern },
      { "customer.email": pattern },
      { "customer.phone": pattern },
      { pickup: pattern },
      { dropoff: pattern },
    ];
  }

  const skip = (query.page - 1) * query.limit;
  const records = await findBookings(filter, skip, query.limit);
  const total = await countBookings(filter);

  return {
    items: records.map((record) => toBookingResponse(record as unknown as BookingRecord)),
    total: total,
    page: query.page,
    limit: query.limit,
  };
}

export async function getBookingDetails(id: string): Promise<BookingResponse> {
  const record = await getBookingRecordOrFail(id);
  return toBookingResponse(record);
}

// ---------- Status ----------

export async function changeBookingStatus(id: string, newStatus: BookingStatus): Promise<BookingResponse> {
  const booking = await getBookingRecordOrFail(id);

  const allowedStatuses = ALLOWED_STATUS_CHANGES[booking.status];
  if (!allowedStatuses.includes(newStatus)) {
    throw new AppError(`A ${booking.status.replace("_", " ")} booking cannot be changed to ${newStatus}`, 400);
  }

  const fieldsToChange: Record<string, unknown> = { status: newStatus };

  // Confirm hone par coupon ka usedCount +1
  if (newStatus === "confirmed") {
    fieldsToChange.couponUsageRecorded = await recordCouponUsageOnce(booking);
  }

  const updated = await updateBookingById(id, fieldsToChange);
  return toBookingResponse(updated as unknown as BookingRecord);
}

export async function cancelBooking(id: string): Promise<BookingResponse> {
  return changeBookingStatus(id, "cancelled");
}

// ---------- Waiting time ----------

// Job ke baad waiting time ka charge (har 5 minute ka price) booking ke total me jorta hai.
// Dobara bhejne par purana waiting charge badal jata hai (double nahi lagta)
export async function setWaitingTime(id: string, minutes: number): Promise<BookingResponse> {
  const booking = await getBookingRecordOrFail(id);

  if (booking.status !== "confirmed" && booking.status !== "completed") {
    throw new AppError("Waiting time can only be added to a confirmed or completed booking", 400);
  }

  const settings = await getSettings();
  const pricePer5Minutes = settings.extras.waitingPricePer5Minutes;
  if (minutes > 0 && pricePer5Minutes <= 0) {
    throw new AppError("Set the waiting price in Settings first", 400);
  }

  // Aadha 5 minute bhi poora 5 minute gina jata hai
  const waitingCharge = roundMoney(Math.ceil(minutes / 5) * pricePer5Minutes);

  const lines = booking.priceLines.filter((line) => line.label !== WAITING_LINE_LABEL);
  if (waitingCharge > 0) {
    lines.push({ label: WAITING_LINE_LABEL, amount: waitingCharge });
  }

  const totalWithoutWaiting = roundMoney(booking.total - booking.waitingCharge);
  const updated = await updateBookingById(id, {
    waitingMinutes: minutes,
    waitingCharge: waitingCharge,
    priceLines: lines,
    total: roundMoney(totalWithoutWaiting + waitingCharge),
  });
  return toBookingResponse(updated as unknown as BookingRecord);
}

// ---------- Payment ----------

// Admin payment status badalta hai (e.g. gaari me cash mil gaya). Card payment Phase 13 me webhook se aayegi
export async function updatePayment(id: string, paymentStatus: PaymentStatus, amountPaid: number): Promise<BookingResponse> {
  const booking = await getBookingRecordOrFail(id);

  let paidAmount = 0;
  if (paymentStatus === "paid") {
    paidAmount = booking.total;
  } else if (paymentStatus === "partially_paid") {
    if (amountPaid <= 0 || amountPaid >= booking.total) {
      throw new AppError("amountPaid: Enter an amount more than 0 and less than the total", 400);
    }
    paidAmount = roundMoney(amountPaid);
  }

  const updated = await updateBookingById(id, { paymentStatus: paymentStatus, amountPaid: paidAmount });
  return toBookingResponse(updated as unknown as BookingRecord);
}
