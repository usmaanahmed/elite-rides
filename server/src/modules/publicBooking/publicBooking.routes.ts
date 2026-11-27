// Website (customer) ke public URLs. In par login nahi chahiye
import { Router } from "express";
import { validate } from "../../middlewares/validate.js";
import { createBookingSchema, createTourBookingSchema } from "../booking/booking.validation.js";
import { quoteSchema } from "../quote/quote.validation.js";
import {
  addPublicBooking,
  addPublicTourBooking,
  getPublicQuotePrices,
  payPublicBookingByCard,
  readPublicAirport,
  readPublicAirports,
  readPublicBlog,
  readPublicBlogs,
  readPublicBooking,
  readPublicDropdownAddresses,
  readPublicSettings,
  readPublicStations,
  readPublicTour,
  readPublicTours,
  readPublicVehicles,
} from "./publicBooking.controller.js";

const router = Router();

router.get("/settings", readPublicSettings);
router.get("/vehicles", readPublicVehicles);
router.get("/airports", readPublicAirports);
router.get("/airports/:id", readPublicAirport);
router.get("/stations", readPublicStations);
router.get("/blogs", readPublicBlogs);
router.get("/blogs/:slug", readPublicBlog);
router.get("/tours", readPublicTours);
router.get("/tours/:id", readPublicTour);
router.post("/tour-bookings", validate(createTourBookingSchema), addPublicTourBooking);
router.get("/dropdown-addresses", readPublicDropdownAddresses);
router.post("/quotes", validate(quoteSchema), getPublicQuotePrices);
router.post("/bookings", validate(createBookingSchema), addPublicBooking);
// :reference = thank-you link ka secret code (booking number nahi)
router.get("/bookings/:reference", readPublicBooking);
router.post("/bookings/:reference/checkout", payPublicBookingByCard);

export default router;
