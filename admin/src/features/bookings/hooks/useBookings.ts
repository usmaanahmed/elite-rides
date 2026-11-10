import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  addBooking,
  cancelBooking,
  changeBookingStatus,
  getBookings,
  setWaitingTime,
  updatePayment,
} from '../api/bookingsApi'
import type { BookingFilters, BookingStatus, PaymentStatus } from '../types/booking'

// The name React Query uses to store the bookings in its cache
export const BOOKINGS_QUERY_KEY = ['bookings']

// Loads the bookings that match the filters. Reloads when a filter changes.
export function useBookings(filters: BookingFilters) {
  return useQuery({
    queryKey: [...BOOKINGS_QUERY_KEY, filters],
    queryFn: () => getBookings(filters),
  })
}

// Creates a booking, then reloads the list
export function useAddBooking() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addBooking,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: BOOKINGS_QUERY_KEY }),
  })
}

// Changes a booking's status, then reloads the list
export function useChangeBookingStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ bookingId, status }: { bookingId: string; status: Exclude<BookingStatus, 'quote_requested'> }) =>
      changeBookingStatus(bookingId, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: BOOKINGS_QUERY_KEY }),
  })
}

// Cancels a booking, then reloads the list
export function useCancelBooking() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: cancelBooking,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: BOOKINGS_QUERY_KEY }),
  })
}

// Saves the waiting time of a booking, then reloads the list
export function useSetWaitingTime() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ bookingId, minutes }: { bookingId: string; minutes: number }) => setWaitingTime(bookingId, minutes),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: BOOKINGS_QUERY_KEY }),
  })
}

// Saves a booking's payment status, then reloads the list
export function useUpdatePayment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ bookingId, paymentStatus, amountPaid }: { bookingId: string; paymentStatus: PaymentStatus; amountPaid: number }) =>
      updatePayment(bookingId, paymentStatus, amountPaid),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: BOOKINGS_QUERY_KEY }),
  })
}
