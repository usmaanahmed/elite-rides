// Booking ke requests lo, service se kaam karwao, response bhejo
import { Request, Response } from "express";
import { AppError } from "../../utils/AppError.js";
import {
  cancelBooking,
  changeBookingStatus,
  createBooking,
  getBookingDetails,
  getBookingList,
  setWaitingTime,
  updatePayment,
} from "./booking.service.js";
import { bookingListQuerySchema } from "./booking.validation.js";

// GET /api/bookings?search=&status=&paymentStatus=&dateFrom=&dateTo=&page=&limit=
export async function getBookings(req: Request, res: Response) {
  const parsed = bookingListQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    throw new AppError(parsed.error.issues[0].message, 400);
  }
  const list = await getBookingList(parsed.data);
  res.json(list);
}

// GET /api/bookings/:id
export async function getBooking(req: Request<{ id: string }>, res: Response) {
  const booking = await getBookingDetails(req.params.id);
  res.json(booking);
}

// POST /api/bookings
export async function addBooking(req: Request, res: Response) {
  const booking = await createBooking(req.body);
  res.status(201).json(booking);
}

// PATCH /api/bookings/:id/status
export async function editBookingStatus(req: Request<{ id: string }>, res: Response) {
  const booking = await changeBookingStatus(req.params.id, req.body.status);
  res.json(booking);
}

// POST /api/bookings/:id/cancel
export async function cancelOneBooking(req: Request<{ id: string }>, res: Response) {
  const booking = await cancelBooking(req.params.id);
  res.json(booking);
}

// PATCH /api/bookings/:id/waiting
export async function editWaitingTime(req: Request<{ id: string }>, res: Response) {
  const booking = await setWaitingTime(req.params.id, req.body.minutes);
  res.json(booking);
}

// PATCH /api/bookings/:id/payment
export async function editPayment(req: Request<{ id: string }>, res: Response) {
  const booking = await updatePayment(req.params.id, req.body.paymentStatus, req.body.amountPaid);
  res.json(booking);
}
