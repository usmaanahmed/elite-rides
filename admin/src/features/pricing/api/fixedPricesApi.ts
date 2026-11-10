import { apiFetch } from '../../../shared/api/apiFetch'
import { readJsonResponse } from '../../../shared/api/readJsonResponse'
import type { FixedPrice, FixedPriceUpdate, ImportResult, NewFixedPrice } from '../types/fixedPrice'

// Loads all saved fixed-price rows
export async function getFixedPrices(): Promise<FixedPrice[]> {
  const response = await apiFetch('/fixed-prices')
  return (await readJsonResponse(response)) as FixedPrice[]
}

// Saves a new route's prices (one request can add a fare for several vehicles at once)
export async function addFixedPrices(fixedPrice: NewFixedPrice): Promise<FixedPrice[]> {
  const response = await apiFetch('/fixed-prices', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(fixedPrice),
  })
  return (await readJsonResponse(response)) as FixedPrice[]
}

// Saves changes to a single fixed-price row
export async function editFixedPrice(fixedPriceId: string, update: FixedPriceUpdate): Promise<FixedPrice> {
  const response = await apiFetch(`/fixed-prices/${fixedPriceId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(update),
  })
  return (await readJsonResponse(response)) as FixedPrice
}

// Deletes a single fixed-price row
export async function deleteFixedPrice(fixedPriceId: string): Promise<void> {
  const response = await apiFetch(`/fixed-prices/${fixedPriceId}`, { method: 'DELETE' })
  await readJsonResponse(response)
}

// Deletes every fixed-price row
export async function deleteAllFixedPrices(): Promise<void> {
  const response = await apiFetch('/fixed-prices/all', { method: 'DELETE' })
  await readJsonResponse(response)
}

// Imports rows from a parsed CSV file. Rows that fail come back in the result's `errors`.
export async function importFixedPrices(rows: Record<string, unknown>[]): Promise<ImportResult> {
  const response = await apiFetch('/fixed-prices/import', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rows }),
  })
  return (await readJsonResponse(response)) as ImportResult
}
