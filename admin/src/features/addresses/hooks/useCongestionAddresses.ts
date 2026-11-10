import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  addCongestionAddress,
  deleteCongestionAddress,
  editCongestionAddress,
  getCongestionAddresses,
} from '../api/congestionAddressesApi'
import type { NewCongestionAddress } from '../types/congestionAddress'

// The name React Query uses to store the congestion addresses in its cache
export const CONGESTION_ADDRESSES_QUERY_KEY = ['congestion-addresses']

// Loads the congestion addresses. Gives back the list plus loading / error info.
export function useCongestionAddresses() {
  return useQuery({
    queryKey: CONGESTION_ADDRESSES_QUERY_KEY,
    queryFn: getCongestionAddresses,
  })
}

// Saves a new congestion address, then reloads the list so the table shows it
export function useAddCongestionAddress() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addCongestionAddress,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CONGESTION_ADDRESSES_QUERY_KEY }),
  })
}

// Saves changes to a congestion address, then reloads the list
export function useEditCongestionAddress() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ addressId, address }: { addressId: string; address: NewCongestionAddress }) =>
      editCongestionAddress(addressId, address),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CONGESTION_ADDRESSES_QUERY_KEY }),
  })
}

// Deletes a congestion address, then reloads the list so the row disappears
export function useDeleteCongestionAddress() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteCongestionAddress,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CONGESTION_ADDRESSES_QUERY_KEY }),
  })
}
