import { useQuery } from '@tanstack/react-query'
import { getVehicles } from '../api/getVehicles'

// The name React Query uses to store the vehicles list in its cache
export const VEHICLES_QUERY_KEY = ['vehicles']

// Loads the vehicles list. Gives back the list plus loading / error info.
export function useVehicles() {
  return useQuery({
    queryKey: VEHICLES_QUERY_KEY,
    queryFn: getVehicles,
  })
}
