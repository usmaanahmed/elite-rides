import { apiFetch } from '../../../shared/api/apiFetch'
import { readJsonResponse } from '../../../shared/api/readJsonResponse'
import type { Vehicle } from '../types/vehicle'
import { withFullImageUrl } from '../utils/withFullImageUrl'

// Loads all saved vehicles from the server
export async function getVehicles(): Promise<Vehicle[]> {
  const response = await apiFetch('/vehicles')
  const vehicles = (await readJsonResponse(response)) as Vehicle[]
  return vehicles.map(withFullImageUrl)
}
