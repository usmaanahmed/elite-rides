import { API_URL } from '../../../shared/api/apiUrl'
import { readJsonResponse } from '../../../shared/api/readJsonResponse'
import type {
  CardCheckout,
  ConfirmedBooking,
  CreateBookingResult,
  DropdownAddress,
  NewBookingRequest,
  PublicSettings,
  PublicVehicle,
  Quote,
  QuoteRequest,
} from '../types/publicApi'

// Loads the booking settings set in the admin panel (max passengers, payment options, extras prices…)
export async function getPublicSettings(): Promise<PublicSettings> {
  const response = await fetch(`${API_URL}/public/settings`)
  return (await readJsonResponse(response)) as PublicSettings
}

// Loads the vehicles (name, photo, seats, luggage)
export async function getPublicVehicles(): Promise<PublicVehicle[]> {
  const response = await fetch(`${API_URL}/public/vehicles`)
  return (await readJsonResponse(response)) as PublicVehicle[]
}

// Loads the airports and stations the office has saved
export async function getDropdownAddresses(): Promise<DropdownAddress[]> {
  const response = await fetch(`${API_URL}/public/dropdown-addresses`)
  return (await readJsonResponse(response)) as DropdownAddress[]
}

// Asks the server for the price of the journey (every vehicle, or one if vehicleId is set)
export async function getQuote(request: QuoteRequest): Promise<Quote> {
  const response = await fetch(`${API_URL}/public/quotes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  })
  return (await readJsonResponse(response)) as Quote
}

// Creates the booking. The server works out the price itself, so no price is sent.
export async function createBooking(request: NewBookingRequest): Promise<CreateBookingResult> {
  const response = await fetch(`${API_URL}/public/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  })
  return (await readJsonResponse(response)) as CreateBookingResult
}

// Loads a booking for the thank-you page by its secret reference code
export async function getBookingByReference(reference: string): Promise<ConfirmedBooking> {
  const response = await fetch(`${API_URL}/public/bookings/${encodeURIComponent(reference)}`)
  return (await readJsonResponse(response)) as ConfirmedBooking
}

// "Pay now": asks the server for a new Stripe payment page for this booking
export async function startCardPayment(reference: string): Promise<CardCheckout> {
  const response = await fetch(`${API_URL}/public/bookings/${encodeURIComponent(reference)}/checkout`, {
    method: 'POST',
  })
  return (await readJsonResponse(response)) as CardCheckout
}
