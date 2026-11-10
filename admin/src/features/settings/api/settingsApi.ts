import { apiFetch } from '../../../shared/api/apiFetch'
import { readJsonResponse } from '../../../shared/api/readJsonResponse'
import type { Settings } from '../types/settings'

// Loads the saved settings
export async function getSettings(): Promise<Settings> {
  const response = await apiFetch('/settings')
  return (await readJsonResponse(response)) as Settings
}

// Saves all the settings in one go
export async function saveSettings(settings: Settings): Promise<Settings> {
  const response = await apiFetch('/settings', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings),
  })
  return (await readJsonResponse(response)) as Settings
}
