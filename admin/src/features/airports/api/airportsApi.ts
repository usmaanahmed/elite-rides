import { apiFetch } from '../../../shared/api/apiFetch'
import { readJsonResponse } from '../../../shared/api/readJsonResponse'
import type { Airport, NewAirport } from '../types/airport'
import { withFullImageUrls } from '../utils/withFullImageUrls'

// Images mean the data has to be sent as FormData instead of JSON
function buildFormData(airport: NewAirport): FormData {
  const formData = new FormData()
  formData.append('name', airport.name)
  formData.append('description', airport.description)
  formData.append('address', airport.address)

  for (const file of airport.newImages) {
    formData.append('images', file)
  }
  // The "[]" tells the server this field is a list, even when it holds only one name
  for (const fileName of airport.removedImages) {
    formData.append('removedImages[]', fileName)
  }
  return formData
}

// Loads all airports
export async function getAirports(): Promise<Airport[]> {
  const response = await apiFetch('/airports')
  const airports = (await readJsonResponse(response)) as Airport[]
  return airports.map(withFullImageUrls)
}

// Saves a new airport
export async function addAirport(airport: NewAirport): Promise<Airport> {
  const response = await apiFetch('/airports', { method: 'POST', body: buildFormData(airport) })
  const savedAirport = (await readJsonResponse(response)) as Airport
  return withFullImageUrls(savedAirport)
}

// Saves changes to an existing airport
export async function editAirport(airportId: string, airport: NewAirport): Promise<Airport> {
  const response = await apiFetch(`/airports/${airportId}`, { method: 'PUT', body: buildFormData(airport) })
  const savedAirport = (await readJsonResponse(response)) as Airport
  return withFullImageUrls(savedAirport)
}

// Deletes an airport (and its images)
export async function deleteAirport(airportId: string): Promise<void> {
  const response = await apiFetch(`/airports/${airportId}`, { method: 'DELETE' })
  await readJsonResponse(response)
}
