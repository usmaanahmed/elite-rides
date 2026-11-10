import { apiFetch } from '../../../shared/api/apiFetch'
import { readJsonResponse } from '../../../shared/api/readJsonResponse'
import type { CalculationFormatItem } from '../types/vehicle'

// Saves every vehicle's calculation format (premium type + value) in one request
export async function updateCalculationFormat(items: CalculationFormatItem[]): Promise<void> {
  const response = await apiFetch('/vehicles/calculation-format', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items }),
  })
  await readJsonResponse(response)
}
