import { useQuery } from '@tanstack/react-query'
import { getPublicAirportById, getPublicAirports } from '../api/airportsApi'

// Airports change rarely, so React Query keeps them for 5 minutes before asking again
const FIVE_MINUTES = 5 * 60 * 1000

// The airports shown in the "Airports" section of the home page
export function usePublicAirports() {
  return useQuery({
    queryKey: ['public-airports'],
    queryFn: getPublicAirports,
    staleTime: FIVE_MINUTES,
  })
}

// One airport, for its detail page. A missing airport (404) is not retried.
export function usePublicAirport(airportId: string) {
  return useQuery({
    queryKey: ['public-airport', airportId],
    queryFn: () => getPublicAirportById(airportId),
    enabled: airportId !== '',
    staleTime: FIVE_MINUTES,
    retry: false,
  })
}
