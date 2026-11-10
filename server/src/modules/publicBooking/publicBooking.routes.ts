// Website (customer) ke public URLs. In par login nahi chahiye
import { Router } from "express";
import { validate } from "../../middlewares/validate.js";
import { createBookingSchema } from "../booking/booking.validation.js";
import { quoteSchema } from "../quote/quote.validation.js";
import {
  addPublicBooking,
  getPublicQuotePrices,
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

export default router;
