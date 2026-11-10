import { apiFetch } from '../../../shared/api/apiFetch'
import { readJsonResponse } from '../../../shared/api/readJsonResponse'
import type { CongestionAddress, NewCongestionAddress } from '../types/congestionAddress'

// Loads all congestion addresses
export async function getCongestionAddresses(): Promise<CongestionAddress[]> {
  const response = await apiFetch('/congestion-addresses')
  return (await readJsonResponse(response)) as CongestionAddress[]
}

// Saves a new congestion address
export async function addCongestionAddress(address: NewCongestionAddress): Promise<CongestionAddress> {
  const response = await apiFetch('/congestion-addresses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(address),
  })
  return (await readJsonResponse(response)) as CongestionAddress
}

// Saves changes to an existing congestion address
export async function editCongestionAddress(addressId: string, address: NewCongestionAddress): Promise<CongestionAddress> {
  const response = await apiFetch(`/congestion-addresses/${addressId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(address),
  })
  return (await readJsonResponse(response)) as CongestionAddress
}

// Deletes a congestion address
export async function deleteCongestionAddress(addressId: string): Promise<void> {
  const response = await apiFetch(`/congestion-addresses/${addressId}`, { method: 'DELETE' })
  await readJsonResponse(response)
}
