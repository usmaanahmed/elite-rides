import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  addFixedPrices,
  deleteAllFixedPrices,
  deleteFixedPrice,
  editFixedPrice,
  getFixedPrices,
  importFixedPrices,
} from '../api/fixedPricesApi'
import type { FixedPriceUpdate } from '../types/fixedPrice'

// The name React Query uses to store the fixed prices list in its cache
export const FIXED_PRICES_QUERY_KEY = ['fixed-prices']

// Loads the fixed prices. Gives back the list plus loading / error info.
export function useFixedPrices() {
  return useQuery({
    queryKey: FIXED_PRICES_QUERY_KEY,
    queryFn: getFixedPrices,
  })
}

// Saves a new route's prices, then reloads the list so the table shows them
export function useAddFixedPrices() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addFixedPrices,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: FIXED_PRICES_QUERY_KEY }),
  })
}

// Saves changes to a row, then reloads the list
export function useEditFixedPrice() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ fixedPriceId, update }: { fixedPriceId: string; update: FixedPriceUpdate }) =>
      editFixedPrice(fixedPriceId, update),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: FIXED_PRICES_QUERY_KEY }),
  })
}

// Deletes a row, then reloads the list so it disappears
export function useDeleteFixedPrice() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteFixedPrice,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: FIXED_PRICES_QUERY_KEY }),
  })
}

// Deletes every row, then reloads the (now empty) list
export function useDeleteAllFixedPrices() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteAllFixedPrices,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: FIXED_PRICES_QUERY_KEY }),
  })
}

// Imports a batch of rows, then reloads the list so the new ones show up
export function useImportFixedPrices() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: importFixedPrices,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: FIXED_PRICES_QUERY_KEY }),
  })
}
