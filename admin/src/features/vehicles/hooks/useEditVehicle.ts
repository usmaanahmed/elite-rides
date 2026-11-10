import { useMutation, useQueryClient } from '@tanstack/react-query'
import { editVehicle } from '../api/editVehicle'
import type { VehicleUpdate } from '../types/vehicle'
import { VEHICLES_QUERY_KEY } from './useVehicles'

// Saves changes to a vehicle, then reloads the vehicles list so the table shows them
export function useEditVehicle() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ vehicleId, vehicle }: { vehicleId: string; vehicle: VehicleUpdate }) => editVehicle(vehicleId, vehicle),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: VEHICLES_QUERY_KEY }),
  })
}
