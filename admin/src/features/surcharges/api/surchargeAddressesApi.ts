import { apiFetch } from '../../../shared/api/apiFetch'
import { readJsonResponse } from '../../../shared/api/readJsonResponse'
import type { NewSurchargeAddress, SurchargeAddress } from '../types/surchargeAddress'

// Loads all surcharge addresses
export async function getSurchargeAddresses(): Promise<SurchargeAddress[]> {
  const response = await apiFetch('/surcharge-addresses')
  return (await readJsonResponse(response)) as SurchargeAddress[]
}

// Saves a new surcharge address
export async function addSurchargeAddress(address: NewSurchargeAddress): Promise<SurchargeAddress> {
  const response = await apiFetch('/surcharge-addresses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(address),
  })
  return (await readJsonResponse(response)) as SurchargeAddress
}

// Saves changes to an existing surcharge address
export async function editSurchargeAddress(addressId: string, address: NewSurchargeAddress): Promise<SurchargeAddress> {
  const response = await apiFetch(`/surcharge-addresses/${addressId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(address),
  })
  return (await readJsonResponse(response)) as SurchargeAddress
}

// Deletes a surcharge address
export async function deleteSurchargeAddress(addressId: string): Promise<void> {
  const response = await apiFetch(`/surcharge-addresses/${addressId}`, { method: 'DELETE' })
  await readJsonResponse(response)
}
