import type { Station, StationFilterValues } from '../types/station'

// Keeps only the stations that match the filter bar (name, address and images)
export function filterStations(stations: Station[], filters: StationFilterValues): Station[] {
  const nameText = filters.name.trim().toLowerCase()
  const addressText = filters.address.trim().toLowerCase()
  const matches: Station[] = []

  for (const station of stations) {
    if (nameText !== '' && !station.name.toLowerCase().includes(nameText)) {
      continue
    }
    if (addressText !== '' && !station.address.toLowerCase().includes(addressText)) {
      continue
    }
    if (filters.images === 'with-images' && station.images.length === 0) {
      continue
    }
    if (filters.images === 'without-images' && station.images.length > 0) {
      continue
    }
    matches.push(station)
  }
  return matches
}
