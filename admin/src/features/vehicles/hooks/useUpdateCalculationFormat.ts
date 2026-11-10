import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateCalculationFormat } from '../api/updateCalculationFormat'
import { VEHICLES_QUERY_KEY } from './useVehicles'

// Saves every vehicle's calculation format, then reloads the vehicles list
export function useUpdateCalculationFormat() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateCalculationFormat,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: VEHICLES_QUERY_KEY }),
  })
}
