import { API_URL } from '../../../shared/api/apiUrl'
import { readJsonResponse } from '../../../shared/api/readJsonResponse'
import type { PublicAirport } from '../types/airport'

// Loads the airports for the home page (name, description, address, photos)
export async function getPublicAirports(): Promise<PublicAirport[]> {
  const response = await fetch(`${API_URL}/public/airports`)
  return (await readJsonResponse(response)) as PublicAirport[]
}

// Loads one airport for its detail page
export async function getPublicAirportById(airportId: string): Promise<PublicAirport> {
  const response = await fetch(`${API_URL}/public/airports/${encodeURIComponent(airportId)}`)
  return (await readJsonResponse(response)) as PublicAirport
}
