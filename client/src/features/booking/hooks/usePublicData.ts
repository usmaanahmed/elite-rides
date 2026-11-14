import { useMutation, useQuery } from '@tanstack/react-query'
import {
  createBooking,
  getBookingByReference,
  getDropdownAddresses,
  getPublicSettings,
  getPublicVehicles,
  getQuote,
  startCardPayment,
} from '../api/publicBookingApi'
import type { QuoteRequest } from '../types/publicApi'

// These change rarely, so React Query keeps them for 5 minutes before asking again
const FIVE_MINUTES = 5 * 60 * 1000

// After paying on Stripe, ask every 2 seconds whether the payment has reached us (at most 15 times = 30 seconds)
const PAYMENT_CHECK_EVERY_MS = 2000
const MAX_PAYMENT_CHECKS = 15

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

// The booking for the thank-you page ("" = no reference in the link, so nothing is loaded).
// When `isWaitingForPayment` is true (the customer just came back from Stripe), it keeps asking
// until the server says the card payment has arrived, because Stripe tells our server a moment later.
export function useBookingByReference(reference: string, isWaitingForPayment: boolean) {
  return useQuery({
    queryKey: ['public-booking', reference],
    queryFn: () => getBookingByReference(reference),
    enabled: reference !== '',
    retry: false,
    refetchInterval: (query) => {
      const booking = query.state.data
      if (!isWaitingForPayment || !booking) {
        return false
      }
      // Paid (nothing left to pay), or we've waited long enough
      if (!booking.canPayByCard || query.state.dataUpdateCount >= MAX_PAYMENT_CHECKS) {
        return false
      }
      return PAYMENT_CHECK_EVERY_MS
    },
  })
}

// "Pay now" on the thank-you page: gets a new Stripe payment page
export function useStartCardPayment() {
  return useMutation({
    mutationFn: startCardPayment,
  })
}
