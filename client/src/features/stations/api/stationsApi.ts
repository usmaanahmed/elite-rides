import { API_URL } from '../../../shared/api/apiUrl'
import { readJsonResponse } from '../../../shared/api/readJsonResponse'
import type { PublicStation } from '../types/station'

// Loads the train stations for the home page (name, description, address, photos)
export async function getPublicStations(): Promise<PublicStation[]> {
  const response = await fetch(`${API_URL}/public/stations`)
  return (await readJsonResponse(response)) as PublicStation[]
}
