import { apiFetch } from '../../../shared/api/apiFetch'
import { readJsonResponse } from '../../../shared/api/readJsonResponse'
import type { BanAddress, NewBanAddress } from '../types/banAddress'

// Loads all banned addresses
export async function getBanAddresses(): Promise<BanAddress[]> {
  const response = await apiFetch('/ban-addresses')
  return (await readJsonResponse(response)) as BanAddress[]
}

// Bans a new address
export async function addBanAddress(banAddress: NewBanAddress): Promise<BanAddress> {
  const response = await apiFetch('/ban-addresses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(banAddress),
  })
  return (await readJsonResponse(response)) as BanAddress
}

// Removes an address from the ban list
export async function deleteBanAddress(banAddressId: string): Promise<void> {
  const response = await apiFetch(`/ban-addresses/${banAddressId}`, { method: 'DELETE' })
  await readJsonResponse(response)
}
