import type { Airport, AirportFilterValues } from '../types/airport'

// Keeps only the airports that match the filter bar (name, address and images)
export function filterAirports(airports: Airport[], filters: AirportFilterValues): Airport[] {
  const nameText = filters.name.trim().toLowerCase()
  const addressText = filters.address.trim().toLowerCase()
  const matches: Airport[] = []

  for (const airport of airports) {
    if (nameText !== '' && !airport.name.toLowerCase().includes(nameText)) {
      continue
    }
    if (addressText !== '' && !airport.address.toLowerCase().includes(addressText)) {
      continue
    }
    if (filters.images === 'with-images' && airport.images.length === 0) {
      continue
    }
    if (filters.images === 'without-images' && airport.images.length > 0) {
      continue
    }
    matches.push(airport)
  }
  return matches
}
