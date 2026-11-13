import { apiFetch } from '../../../shared/api/apiFetch'
import { readJsonResponse } from '../../../shared/api/readJsonResponse'
import type { NewSurchargeNight, SurchargeNight } from '../types/surchargeNight'

// Loads all night surcharges
export async function getSurchargeNights(): Promise<SurchargeNight[]> {
  const response = await apiFetch('/surcharge-night')
  return (await readJsonResponse(response)) as SurchargeNight[]
}

// Saves a new night surcharge
export async function addSurchargeNight(surcharge: NewSurchargeNight): Promise<SurchargeNight> {
  const response = await apiFetch('/surcharge-night', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(surcharge),
  })
  return (await readJsonResponse(response)) as SurchargeNight
}

// Saves changes to an existing night surcharge
export async function editSurchargeNight(surchargeId: string, surcharge: NewSurchargeNight): Promise<SurchargeNight> {
  const response = await apiFetch(`/surcharge-night/${surchargeId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(surcharge),
  })
  return (await readJsonResponse(response)) as SurchargeNight
}

// Deletes a night surcharge
export async function deleteSurchargeNight(surchargeId: string): Promise<void> {
  const response = await apiFetch(`/surcharge-night/${surchargeId}`, { method: 'DELETE' })
  await readJsonResponse(response)
}
