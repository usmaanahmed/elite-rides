import { apiFetch } from '../../../shared/api/apiFetch'
import { readJsonResponse } from '../../../shared/api/readJsonResponse'
import type { NewSurchargeDate, SurchargeDate } from '../types/surchargeDate'

// Loads all surcharges on date
export async function getSurchargeDates(): Promise<SurchargeDate[]> {
  const response = await apiFetch('/surcharge-dates')
  return (await readJsonResponse(response)) as SurchargeDate[]
}

// Saves a new surcharge on date
export async function addSurchargeDate(surcharge: NewSurchargeDate): Promise<SurchargeDate> {
  const response = await apiFetch('/surcharge-dates', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(surcharge),
  })
  return (await readJsonResponse(response)) as SurchargeDate
}

// Saves changes to an existing surcharge on date
export async function editSurchargeDate(surchargeId: string, surcharge: NewSurchargeDate): Promise<SurchargeDate> {
  const response = await apiFetch(`/surcharge-dates/${surchargeId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(surcharge),
  })
  return (await readJsonResponse(response)) as SurchargeDate
}

// Deletes a surcharge on date
export async function deleteSurchargeDate(surchargeId: string): Promise<void> {
  const response = await apiFetch(`/surcharge-dates/${surchargeId}`, { method: 'DELETE' })
  await readJsonResponse(response)
}
