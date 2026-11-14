import { apiFetch } from '../../../shared/api/apiFetch'
import { readJsonResponse } from '../../../shared/api/readJsonResponse'
import type { Station, NewStation } from '../types/station'
import { withFullImageUrls } from '../utils/withFullImageUrls'

// Images mean the data has to be sent as FormData instead of JSON
function buildFormData(station: NewStation): FormData {
  const formData = new FormData()
  formData.append('name', station.name)
  formData.append('description', station.description)
  formData.append('address', station.address)

  for (const file of station.newImages) {
    formData.append('images', file)
  }
  // The "[]" tells the server this field is a list, even when it holds only one name
  for (const fileName of station.removedImages) {
    formData.append('removedImages[]', fileName)
  }
  return formData
}

// Loads all stations
export async function getStations(): Promise<Station[]> {
  const response = await apiFetch('/stations')
  const stations = (await readJsonResponse(response)) as Station[]
  return stations.map(withFullImageUrls)
}

// Saves a new station
export async function addStation(station: NewStation): Promise<Station> {
  const response = await apiFetch('/stations', { method: 'POST', body: buildFormData(station) })
  const savedStation = (await readJsonResponse(response)) as Station
  return withFullImageUrls(savedStation)
}

// Saves changes to an existing station
export async function editStation(stationId: string, station: NewStation): Promise<Station> {
  const response = await apiFetch(`/stations/${stationId}`, { method: 'PUT', body: buildFormData(station) })
  const savedStation = (await readJsonResponse(response)) as Station
  return withFullImageUrls(savedStation)
}

// Deletes a station (and its images)
export async function deleteStation(stationId: string): Promise<void> {
  const response = await apiFetch(`/stations/${stationId}`, { method: 'DELETE' })
  await readJsonResponse(response)
}
