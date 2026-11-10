// Booking module ke URLs
import { Router } from "express";
import { validate } from "../../middlewares/validate.js";
import {
  addBooking,
  cancelOneBooking,
  editBookingStatus,
  editPayment,
  editWaitingTime,
  getBooking,
  getBookings,
} from "./booking.controller.js";
import { bookingStatusSchema, createBookingSchema, paymentUpdateSchema, waitingTimeSchema } from "./booking.validation.js";

const router = Router();

router.get("/", getBookings);
router.get("/:id", getBooking);
router.post("/", validate(createBookingSchema), addBooking);
router.patch("/:id/status", validate(bookingStatusSchema), editBookingStatus);
router.post("/:id/cancel", cancelOneBooking);
router.patch("/:id/waiting", validate(waitingTimeSchema), editWaitingTime);
router.patch("/:id/payment", validate(paymentUpdateSchema), editPayment);

export default router;
