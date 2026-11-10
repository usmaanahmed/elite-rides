import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { addSurchargeDate, deleteSurchargeDate, editSurchargeDate, getSurchargeDates } from '../api/surchargeDatesApi'
import type { NewSurchargeDate } from '../types/surchargeDate'

// The name React Query uses to store the surcharges on date in its cache
export const SURCHARGE_DATES_QUERY_KEY = ['surcharge-dates']

// Loads the surcharges on date. Gives back the list plus loading / error info.
export function useSurchargeDates() {
  return useQuery({
    queryKey: SURCHARGE_DATES_QUERY_KEY,
    queryFn: getSurchargeDates,
  })
}

// Saves a new surcharge, then reloads the list so the table shows it
export function useAddSurchargeDate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addSurchargeDate,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SURCHARGE_DATES_QUERY_KEY }),
  })
}

// Saves changes to a surcharge, then reloads the list
export function useEditSurchargeDate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ surchargeId, surcharge }: { surchargeId: string; surcharge: NewSurchargeDate }) =>
      editSurchargeDate(surchargeId, surcharge),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SURCHARGE_DATES_QUERY_KEY }),
  })
}

// Deletes a surcharge, then reloads the list so the row disappears
export function useDeleteSurchargeDate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteSurchargeDate,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SURCHARGE_DATES_QUERY_KEY }),
  })
}
