import { useMutation, useQuery } from '@tanstack/react-query'
import { createBooking, getDropdownAddresses, getPublicSettings, getPublicVehicles, getQuote } from '../api/publicBookingApi'
import type { QuoteRequest } from '../types/publicApi'

// These change rarely, so React Query keeps them for 5 minutes before asking again
const FIVE_MINUTES = 5 * 60 * 1000

// Booking settings from the admin panel
export function usePublicSettings() {
  return useQuery({
    queryKey: ['public-settings'],
    queryFn: getPublicSettings,
    staleTime: FIVE_MINUTES,
  })
}

// Vehicles with their photos and capacity
export function usePublicVehicles() {
  return useQuery({
    queryKey: ['public-vehicles'],
    queryFn: getPublicVehicles,
    staleTime: FIVE_MINUTES,
  })
}

// Airports and stations, shown first in the address suggestions
export function useDropdownAddresses() {
  return useQuery({
    queryKey: ['public-dropdown-addresses'],
    queryFn: getDropdownAddresses,
    staleTime: FIVE_MINUTES,
  })
}

// Price of a journey. Asks again whenever anything in the request changes (extras, coupon…).
// `enabled` is false while there is no journey to price yet.
export function useJourneyQuote(request: QuoteRequest | null) {
  return useQuery({
    queryKey: ['public-quote', request],
    queryFn: () => getQuote(request as QuoteRequest),
    enabled: request !== null,
    // A failed quote is usually a real problem (blocked date, bad address), so don't retry it
    retry: false,
    // Keep the last prices on screen while new ones load
    placeholderData: (previousData) => previousData,
  })
}

// Checks a coupon by asking for a price with it: the server answers with an error if the coupon is not valid
export function useCouponCheck() {
  return useMutation({
    mutationFn: getQuote,
  })
}

// Creates the booking
export function useCreateBooking() {
  return useMutation({
    mutationFn: createBooking,
  })
}
