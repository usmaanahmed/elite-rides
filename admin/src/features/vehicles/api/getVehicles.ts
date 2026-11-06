import { API_URL } from '../../../shared/api/apiUrl'
import { readJsonResponse } from '../../../shared/api/readJsonResponse'
import type { Vehicle } from '../types/vehicle'
import { withFullImageUrl } from '../utils/withFullImageUrl'

// Loads all saved vehicles from the server
export async function getVehicles(): Promise<Vehicle[]> {
  const response = await fetch(`${API_URL}/vehicles`)
  const vehicles = (await readJsonResponse(response)) as Vehicle[]
  return vehicles.map(withFullImageUrl)
}
