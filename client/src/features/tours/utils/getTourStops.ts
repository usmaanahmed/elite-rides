import type { PublicTour, TourStop } from '../types/tour'

// Puts all places of all days into one numbered list: 1, 2, 3 ...
// The very first place is the start of the journey, the very last one is the end.
export function getTourStops(tour: PublicTour): TourStop[] {
  const stops: TourStop[] = []

  for (let dayIndex = 0; dayIndex < tour.itinerary.length; dayIndex++) {
    const day = tour.itinerary[dayIndex]
    for (const place of day.places) {
      stops.push({
        stopNumber: stops.length + 1,
        dayNumber: dayIndex + 1,
        place: place,
        isStart: false,
        isEnd: false,
      })
    }
  }

  if (stops.length > 0) {
    stops[0].isStart = true
    stops[stops.length - 1].isEnd = true
  }
  return stops
}

// Only the stops that have a position, so they can be put on the map
export function getStopsWithLocation(stops: TourStop[]): TourStop[] {
  const stopsOnMap: TourStop[] = []
  for (const stop of stops) {
    if (stop.place.lat !== 0 || stop.place.lng !== 0) {
      stopsOnMap.push(stop)
    }
  }
  return stopsOnMap
}
