import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateVehicleRates } from '../api/updateVehicleRates'
import type { VehicleRates } from '../types/vehicle'
import { VEHICLES_QUERY_KEY } from './useVehicles'

// Saves a vehicle's rates, then reloads the vehicles list
export function useUpdateVehicleRates() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ vehicleId, rates }: { vehicleId: string; rates: VehicleRates }) => updateVehicleRates(vehicleId, rates),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: VEHICLES_QUERY_KEY }),
  })
}
