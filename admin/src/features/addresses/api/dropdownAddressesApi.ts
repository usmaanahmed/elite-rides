import { apiFetch } from '../../../shared/api/apiFetch'
import { readJsonResponse } from '../../../shared/api/readJsonResponse'
import type { DropdownAddress, ImportResult, NewDropdownAddress } from '../types/dropdownAddress'

// Loads all saved drop down addresses
export async function getDropdownAddresses(): Promise<DropdownAddress[]> {
  const response = await apiFetch('/dropdown-addresses')
  return (await readJsonResponse(response)) as DropdownAddress[]
}

// Saves a new drop down address
export async function addDropdownAddress(address: NewDropdownAddress): Promise<DropdownAddress> {
  const response = await apiFetch('/dropdown-addresses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(address),
  })
  return (await readJsonResponse(response)) as DropdownAddress
}

// Saves changes to an existing drop down address
export async function editDropdownAddress(addressId: string, address: NewDropdownAddress): Promise<DropdownAddress> {
  const response = await apiFetch(`/dropdown-addresses/${addressId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(address),
  })
  return (await readJsonResponse(response)) as DropdownAddress
}

// Deletes a drop down address
export async function deleteDropdownAddress(addressId: string): Promise<void> {
  const response = await apiFetch(`/dropdown-addresses/${addressId}`, { method: 'DELETE' })
  await readJsonResponse(response)
}

// Imports addresses from a parsed CSV file. Rows that fail come back in the result's `errors`.
export async function importDropdownAddresses(rows: Record<string, unknown>[]): Promise<ImportResult> {
  const response = await apiFetch('/dropdown-addresses/import', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rows }),
  })
  return (await readJsonResponse(response)) as ImportResult
}
