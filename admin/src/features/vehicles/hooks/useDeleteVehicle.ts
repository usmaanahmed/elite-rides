import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteVehicle } from '../api/deleteVehicle'
import { VEHICLES_QUERY_KEY } from './useVehicles'

// Deletes a vehicle, then reloads the vehicles list so the row disappears
export function useDeleteVehicle() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteVehicle,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: VEHICLES_QUERY_KEY }),
  })
}
