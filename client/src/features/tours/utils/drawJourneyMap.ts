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
