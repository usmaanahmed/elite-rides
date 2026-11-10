import { apiFetch } from '../../../shared/api/apiFetch'
import { readJsonResponse } from '../../../shared/api/readJsonResponse'
import type { Booking, BookingFilters, BookingList, BookingStatus, NewBooking, PaymentStatus } from '../types/booking'

// The newest bookings are loaded in one go and searched/sorted in the table.
// Use the date filters to look further back.
const BOOKINGS_LIMIT = 1000

// Loads bookings that match the filters
export async function getBookings(filters: BookingFilters): Promise<BookingList> {
  const params = new URLSearchParams({ limit: String(BOOKINGS_LIMIT) })
  if (filters.status) params.set('status', filters.status)
  if (filters.paymentStatus) params.set('paymentStatus', filters.paymentStatus)
  if (filters.dateFrom) params.set('dateFrom', filters.dateFrom)
  if (filters.dateTo) params.set('dateTo', filters.dateTo)

  const response = await apiFetch(`/bookings?${params.toString()}`)
  return (await readJsonResponse(response)) as BookingList
}

// Creates a booking. The server works out the price again, so none is sent.
export async function addBooking(booking: NewBooking): Promise<Booking> {
  const response = await apiFetch('/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(booking),
  })
  return (await readJsonResponse(response)) as Booking
}

// Moves a booking to a new status, e.g. pending -> confirmed
export async function changeBookingStatus(bookingId: string, status: Exclude<BookingStatus, 'quote_requested'>): Promise<Booking> {
  const response = await apiFetch(`/bookings/${bookingId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  })
  return (await readJsonResponse(response)) as Booking
}

// Cancels a booking
export async function cancelBooking(bookingId: string): Promise<Booking> {
  const response = await apiFetch(`/bookings/${bookingId}/cancel`, { method: 'POST' })
  return (await readJsonResponse(response)) as Booking
}

// Sets how long the driver waited. The server adds the charge to the total.
export async function setWaitingTime(bookingId: string, minutes: number): Promise<Booking> {
  const response = await apiFetch(`/bookings/${bookingId}/waiting`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ minutes }),
  })
  return (await readJsonResponse(response)) as Booking
}

// Updates how much of the booking has been paid
export async function updatePayment(bookingId: string, paymentStatus: PaymentStatus, amountPaid: number): Promise<Booking> {
  const response = await apiFetch(`/bookings/${bookingId}/payment`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ paymentStatus, amountPaid }),
  })
  return (await readJsonResponse(response)) as Booking
}
