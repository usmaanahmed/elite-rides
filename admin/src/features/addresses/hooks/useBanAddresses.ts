import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { addBanAddress, deleteBanAddress, getBanAddresses } from '../api/banAddressesApi'

// The name React Query uses to store the banned addresses in its cache
export const BAN_ADDRESSES_QUERY_KEY = ['ban-addresses']

// Loads the banned addresses. Gives back the list plus loading / error info.
export function useBanAddresses() {
  return useQuery({
    queryKey: BAN_ADDRESSES_QUERY_KEY,
    queryFn: getBanAddresses,
  })
}

// Bans a new address, then reloads the list so the table shows it
export function useAddBanAddress() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addBanAddress,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: BAN_ADDRESSES_QUERY_KEY }),
  })
}

// Removes an address from the ban list, then reloads the list
export function useDeleteBanAddress() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteBanAddress,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: BAN_ADDRESSES_QUERY_KEY }),
  })
}
