import { useMutation, useQuery } from '@tanstack/react-query'
import { createTourBooking, getPublicTourById, getPublicTours } from '../api/toursApi'

// Tours change rarely, so React Query keeps them for 5 minutes before asking again
const FIVE_MINUTES = 5 * 60 * 1000

// The tours shown in the "Tours" section of the home page
export function usePublicTours() {
  return useQuery({
    queryKey: ['public-tours'],
    queryFn: getPublicTours,
    staleTime: FIVE_MINUTES,
  })
}

// One tour, for its detail page and the booking page. A missing tour (404) is not retried.
export function usePublicTour(tourId: string) {
  return useQuery({
    queryKey: ['public-tour', tourId],
    queryFn: () => getPublicTourById(tourId),
    enabled: tourId !== '',
    staleTime: FIVE_MINUTES,
    retry: false,
  })
}

// Creates the tour booking
export function useCreateTourBooking() {
  return useMutation({
    mutationFn: createTourBooking,
  })
}
