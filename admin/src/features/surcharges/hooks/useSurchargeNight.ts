import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  addSurchargeNight,
  deleteSurchargeNight,
  editSurchargeNight,
  getSurchargeNights,
} from '../api/surchargeNightApi'
import type { NewSurchargeNight } from '../types/surchargeNight'

// The name React Query uses to store the night surcharges in its cache
export const SURCHARGE_NIGHT_QUERY_KEY = ['surcharge-night']

// Loads the night surcharges. Gives back the list plus loading / error info.
export function useSurchargeNights() {
  return useQuery({
    queryKey: SURCHARGE_NIGHT_QUERY_KEY,
    queryFn: getSurchargeNights,
  })
}

// Saves a new night surcharge, then reloads the list so the table shows it
export function useAddSurchargeNight() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addSurchargeNight,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SURCHARGE_NIGHT_QUERY_KEY }),
  })
}

// Saves changes to a night surcharge, then reloads the list
export function useEditSurchargeNight() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ surchargeId, surcharge }: { surchargeId: string; surcharge: NewSurchargeNight }) =>
      editSurchargeNight(surchargeId, surcharge),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SURCHARGE_NIGHT_QUERY_KEY }),
  })
}

// Deletes a night surcharge, then reloads the list so the row disappears
export function useDeleteSurchargeNight() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteSurchargeNight,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SURCHARGE_NIGHT_QUERY_KEY }),
  })
}
