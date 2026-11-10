import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  addDropdownAddress,
  deleteDropdownAddress,
  editDropdownAddress,
  getDropdownAddresses,
  importDropdownAddresses,
} from '../api/dropdownAddressesApi'
import type { NewDropdownAddress } from '../types/dropdownAddress'

// The name React Query uses to store the drop down addresses in its cache
export const DROPDOWN_ADDRESSES_QUERY_KEY = ['dropdown-addresses']

// Loads the drop down addresses. Gives back the list plus loading / error info.
export function useDropdownAddresses() {
  return useQuery({
    queryKey: DROPDOWN_ADDRESSES_QUERY_KEY,
    queryFn: getDropdownAddresses,
  })
}

// Saves a new address, then reloads the list so the table shows it
export function useAddDropdownAddress() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addDropdownAddress,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: DROPDOWN_ADDRESSES_QUERY_KEY }),
  })
}

// Saves changes to an address, then reloads the list
export function useEditDropdownAddress() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ addressId, address }: { addressId: string; address: NewDropdownAddress }) =>
      editDropdownAddress(addressId, address),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: DROPDOWN_ADDRESSES_QUERY_KEY }),
  })
}

// Deletes an address, then reloads the list so the row disappears
export function useDeleteDropdownAddress() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteDropdownAddress,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: DROPDOWN_ADDRESSES_QUERY_KEY }),
  })
}

// Imports a batch of addresses, then reloads the list so the new ones show up
export function useImportDropdownAddresses() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: importDropdownAddresses,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: DROPDOWN_ADDRESSES_QUERY_KEY }),
  })
}
