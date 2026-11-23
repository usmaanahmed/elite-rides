import type { TourStop } from '../types/tour'

// Google allows only a few stops in between in a link, the rest are skipped
const MAX_WAYPOINTS = 8

// "51.17,-1.82"
function toPositionText(stop: TourStop): string {
  return `${stop.place.lat},${stop.place.lng}`
}

// A Google Maps link that opens the whole journey as a driving route (no API key needed).
// The stops must already have a map position (see getStopsWithLocation).
export function buildRouteLink(stops: TourStop[]): string {
  if (stops.length === 0) {
    return ''
  }

  const firstStop = stops[0]
  const lastStop = stops[stops.length - 1]
  const params = new URLSearchParams({
    api: '1',
    origin: toPositionText(firstStop),
    destination: toPositionText(lastStop),
    travelmode: 'driving',
  })

  const waypoints: string[] = []
  for (let index = 1; index < stops.length - 1; index++) {
    if (waypoints.length < MAX_WAYPOINTS) {
      waypoints.push(toPositionText(stops[index]))
    }
  }
  if (waypoints.length > 0) {
    params.set('waypoints', waypoints.join('|'))
  }

  return `https://www.google.com/maps/dir/?${params.toString()}`
}
