import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addVehicle } from '../api/addVehicle'
import { VEHICLES_QUERY_KEY } from './useVehicles'

// Saves a new vehicle, then reloads the vehicles list so the table shows it
export function useAddVehicle() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addVehicle,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: VEHICLES_QUERY_KEY }),
  })
}
