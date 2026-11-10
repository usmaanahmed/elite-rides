import { apiFetch } from '../../../shared/api/apiFetch'
import { readJsonResponse } from '../../../shared/api/readJsonResponse'
import type { SurchargeNight } from '../types/surchargeNight'

// Loads the night surcharge
export async function getSurchargeNight(): Promise<SurchargeNight> {
  const response = await apiFetch('/surcharge-night')
  return (await readJsonResponse(response)) as SurchargeNight
}

// Saves the night surcharge
export async function saveSurchargeNight(surcharge: SurchargeNight): Promise<SurchargeNight> {
  const response = await apiFetch('/surcharge-night', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(surcharge),
  })
  return (await readJsonResponse(response)) as SurchargeNight
}
