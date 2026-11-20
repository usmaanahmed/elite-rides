import { API_URL } from '../../../shared/api/apiUrl'
import { readJsonResponse } from '../../../shared/api/readJsonResponse'
import type { CreateBookingResult } from '../../booking/types/publicApi'
import type { NewTourBookingRequest, PublicTour } from '../types/tour'

// Loads the tours for the home page (title, photos, prices)
export async function getPublicTours(): Promise<PublicTour[]> {
  const response = await fetch(`${API_URL}/public/tours`)
  return (await readJsonResponse(response)) as PublicTour[]
}

// Loads one tour for its detail page
export async function getPublicTourById(tourId: string): Promise<PublicTour> {
  const response = await fetch(`${API_URL}/public/tours/${encodeURIComponent(tourId)}`)
  return (await readJsonResponse(response)) as PublicTour
}

// Creates the tour booking. The server works out the price itself, so no price is sent.
export async function createTourBooking(request: NewTourBookingRequest): Promise<CreateBookingResult> {
  const response = await fetch(`${API_URL}/public/tour-bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  })
  return (await readJsonResponse(response)) as CreateBookingResult
}
