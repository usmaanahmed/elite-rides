import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getSurchargeNight, saveSurchargeNight } from '../api/surchargeNightApi'

// The name React Query uses to store the night surcharge in its cache
export const SURCHARGE_NIGHT_QUERY_KEY = ['surcharge-night']

// Loads the night surcharge. Gives back the data plus loading / error info.
export function useSurchargeNight() {
  return useQuery({
    queryKey: SURCHARGE_NIGHT_QUERY_KEY,
    queryFn: getSurchargeNight,
  })
}

// Saves the night surcharge, then reloads it
export function useSaveSurchargeNight() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: saveSurchargeNight,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SURCHARGE_NIGHT_QUERY_KEY }),
  })
}
