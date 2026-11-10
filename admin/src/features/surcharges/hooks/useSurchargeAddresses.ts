import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  addSurchargeAddress,
  deleteSurchargeAddress,
  editSurchargeAddress,
  getSurchargeAddresses,
} from '../api/surchargeAddressesApi'
import type { NewSurchargeAddress } from '../types/surchargeAddress'

// The name React Query uses to store the surcharge addresses in its cache
export const SURCHARGE_ADDRESSES_QUERY_KEY = ['surcharge-addresses']

// Loads the surcharge addresses. Gives back the list plus loading / error info.
export function useSurchargeAddresses() {
  return useQuery({
    queryKey: SURCHARGE_ADDRESSES_QUERY_KEY,
    queryFn: getSurchargeAddresses,
  })
}

// Saves a new surcharge address, then reloads the list so the table shows it
export function useAddSurchargeAddress() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addSurchargeAddress,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SURCHARGE_ADDRESSES_QUERY_KEY }),
  })
}

// Saves changes to a surcharge address, then reloads the list
export function useEditSurchargeAddress() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ addressId, address }: { addressId: string; address: NewSurchargeAddress }) =>
      editSurchargeAddress(addressId, address),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SURCHARGE_ADDRESSES_QUERY_KEY }),
  })
}

// Deletes a surcharge address, then reloads the list so the row disappears
export function useDeleteSurchargeAddress() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteSurchargeAddress,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SURCHARGE_ADDRESSES_QUERY_KEY }),
  })
}
