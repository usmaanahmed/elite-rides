// Draws a tour journey on a Google map: one numbered pin per stop, joined by a dashed line in order.
// Needs "Maps JavaScript API" on the Google key (the same key as the address suggestions).
import { getGoogle, loadGoogleMaps } from '../../../shared/google/googleLoader'
import type { TourStop } from '../types/tour'

// Google needs a "Map ID" for the modern pins. "DEMO_MAP_ID" works for testing;
// for the live website make one in Google Cloud (Map Management) and put it in VITE_GOOGLE_MAP_ID.
const MAP_ID: string = (import.meta.env.VITE_GOOGLE_MAP_ID || 'DEMO_MAP_ID').trim()
// Brand orange, same as --accent
const LINE_COLOUR = '#fc6203'

// The small part of Google's library we use (written by hand, so no extra types package is needed)
type Position = { lat: number; lng: number }

type GoogleMap = {
  fitBounds: (bounds: object, padding: number) => void
  setCenter: (position: Position) => void
  setZoom: (zoom: number) => void
}

type MapsLibrary = {
  Map: new (element: HTMLElement, options: object) => GoogleMap
  Polyline: new (options: object) => object
}

type MarkerLibrary = {
  AdvancedMarkerElement: new (options: object) => object
}

type CoreLibrary = {
  LatLngBounds: new () => { extend: (position: Position) => void }
}

function toPosition(stop: TourStop): Position {
  return { lat: stop.place.lat, lng: stop.place.lng }
}

// The round numbered pin of one stop. Start = orange, end = white, the stops in between = dark with an orange ring.
function createStopPin(stop: TourStop): HTMLElement {
  let colourClasses = 'bg-night text-white ring-2 ring-accent'
  if (stop.isStart) {
    colourClasses = 'bg-accent text-white ring-4 ring-accent/30'
  } else if (stop.isEnd) {
    colourClasses = 'bg-white text-night ring-4 ring-white/30'
  }

  const pin = document.createElement('div')
  pin.className = `grid size-8 place-items-center rounded-full text-xs font-bold shadow-lg ${colourClasses}`
  pin.textContent = String(stop.stopNumber)
  return pin
}

// The small round car icon shown in the middle of the line between two stops
function createTransferPin(): HTMLElement {
  const pin = document.createElement('div')
  pin.className = 'grid size-7 place-items-center rounded-full bg-night text-white ring-1 ring-white/30 shadow-lg'
  // Same "car" icon as the timeline (lucide car)
  pin.innerHTML =
    '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/>' +
    '<circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>'
  return pin
}

// The point halfway between two stops
function getMiddlePosition(from: TourStop, to: TourStop): Position {
  return {
    lat: (from.place.lat + to.place.lat) / 2,
    lng: (from.place.lng + to.place.lng) / 2,
  }
}

// The tooltip of a pin, e.g. "1. Start: Buckingham Palace"
function getPinTitle(stop: TourStop): string {
  let label = `Day ${stop.dayNumber}`
  if (stop.isStart) {
    label = 'Start'
  } else if (stop.isEnd) {
    label = 'End'
  }
  return `${stop.stopNumber}. ${label}: ${stop.place.name}`
}

// Draws the map inside the given box. Resolves true when the map is shown, false if Google could not load.
// The stops must already have a map position (see getStopsWithLocation).
export async function drawJourneyMap(element: HTMLElement, stops: TourStop[]): Promise<boolean> {
  try {
    const isReady = await loadGoogleMaps()
    const google = getGoogle()
    if (!isReady || !google || stops.length === 0) {
      return false
    }

    const mapsLibrary = (await google.maps.importLibrary('maps')) as MapsLibrary
    const markerLibrary = (await google.maps.importLibrary('marker')) as MarkerLibrary
    const coreLibrary = (await google.maps.importLibrary('core')) as CoreLibrary

    const map = new mapsLibrary.Map(element, {
      mapId: MAP_ID,
      colorScheme: 'DARK',
      center: toPosition(stops[0]),
      zoom: 11,
      disableDefaultUI: true,
      zoomControl: true,
      fullscreenControl: true,
      // One finger scrolls the page on phones, two fingers move the map
      gestureHandling: 'cooperative',
    })

    // One pin per stop
    const bounds = new coreLibrary.LatLngBounds()
    for (const stop of stops) {
      new markerLibrary.AdvancedMarkerElement({
        map: map,
        position: toPosition(stop),
        content: createStopPin(stop),
        title: getPinTitle(stop),
        // The start pin is drawn on top when pins overlap
        zIndex: stop.isStart ? 1000 : stops.length - stop.stopNumber,
      })
      bounds.extend(toPosition(stop))
    }

    // A dashed orange line from stop to stop, in order
    const linePath: Position[] = []
    for (const stop of stops) {
      linePath.push(toPosition(stop))
    }
    new mapsLibrary.Polyline({
      map: map,
      path: linePath,
      geodesic: true,
      strokeOpacity: 0,
      icons: [
        {
          icon: { path: 'M 0,-1 0,1', strokeOpacity: 0.9, strokeColor: LINE_COLOUR, scale: 3 },
          offset: '0',
          repeat: '14px',
        },
      ],
    })

    // A car icon in the middle of each line between two stops of the same day
    for (let index = 0; index < stops.length - 1; index++) {
      const fromStop = stops[index]
      const toStop = stops[index + 1]
      if (fromStop.dayNumber !== toStop.dayNumber) {
        continue
      }
      new markerLibrary.AdvancedMarkerElement({
        map: map,
        position: getMiddlePosition(fromStop, toStop),
        content: createTransferPin(),
        title: 'Private transfer',
        zIndex: 1,
      })
    }

    // Zoom so every stop fits. A single stop gets a fixed zoom instead (fitBounds would zoom in too far).
    if (stops.length === 1) {
      map.setCenter(toPosition(stops[0]))
      map.setZoom(13)
    } else {
      map.fitBounds(bounds, 60)
    }
    return true
  } catch (error) {
    console.warn('The tour map could not be shown:', error)
    return false
  }
}
