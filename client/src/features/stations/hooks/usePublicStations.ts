import { useQuery } from '@tanstack/react-query'
import { getPublicStations } from '../api/stationsApi'

// Stations change rarely, so React Query keeps them for 5 minutes before asking again
const FIVE_MINUTES = 5 * 60 * 1000

// The train stations shown in the "Stations" section of the home page
export function usePublicStations() {
  return useQuery({
    queryKey: ['public-stations'],
    queryFn: getPublicStations,
    staleTime: FIVE_MINUTES,
  })
}
