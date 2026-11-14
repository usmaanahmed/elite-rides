// Website (customer) ke public URLs. In par login nahi chahiye
import { Router } from "express";
import { validate } from "../../middlewares/validate.js";
import { createBookingSchema } from "../booking/booking.validation.js";
import { quoteSchema } from "../quote/quote.validation.js";
import {
  addPublicBooking,
  getPublicQuotePrices,
  payPublicBookingByCard,
  readPublicBooking,
  readPublicDropdownAddresses,
  readPublicSettings,
  readPublicVehicles,
} from "./publicBooking.controller.js";

const router = Router();

router.get("/settings", readPublicSettings);
router.get("/vehicles", readPublicVehicles);
router.get("/dropdown-addresses", readPublicDropdownAddresses);
router.post("/quotes", validate(quoteSchema), getPublicQuotePrices);
router.post("/bookings", validate(createBookingSchema), addPublicBooking);
// :reference = thank-you link ka secret code (booking number nahi)
router.get("/bookings/:reference", readPublicBooking);
router.post("/bookings/:reference/checkout", payPublicBookingByCard);

export default router;
