// Website ke public requests lo, service se kaam karwao, response bhejo
import { Request, Response } from "express";
import {
  createPublicBooking,
  getPublicBooking,
  getPublicDropdownAddresses,
  getPublicQuote,
  getPublicSettings,
  getPublicVehicles,
  startPublicCardPayment,
} from "./publicBooking.service.js";

// GET /api/public/settings
export async function readPublicSettings(req: Request, res: Response) {
  const settings = await getPublicSettings();
  res.json(settings);
}

// GET /api/public/vehicles
export async function readPublicVehicles(req: Request, res: Response) {
  const vehicles = await getPublicVehicles();
  res.json(vehicles);
}

// GET /api/public/dropdown-addresses
export async function readPublicDropdownAddresses(req: Request, res: Response) {
  const addresses = await getPublicDropdownAddresses();
  res.json(addresses);
}

// POST /api/public/quotes
export async function getPublicQuotePrices(req: Request, res: Response) {
  const quote = await getPublicQuote(req.body);
  res.json(quote);
}

// POST /api/public/bookings
export async function addPublicBooking(req: Request, res: Response) {
  const result = await createPublicBooking(req.body);
  res.status(201).json(result);
}

// GET /api/public/bookings/:reference
export async function readPublicBooking(req: Request<{ reference: string }>, res: Response) {
  const booking = await getPublicBooking(req.params.reference);
  res.json(booking);
}

// POST /api/public/bookings/:reference/checkout
export async function payPublicBookingByCard(req: Request<{ reference: string }>, res: Response) {
  const result = await startPublicCardPayment(req.params.reference);
  res.json(result);
}
