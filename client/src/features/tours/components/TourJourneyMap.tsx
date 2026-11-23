import { ArrowUpRight, Car, LoaderCircle, MapPinned } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { TourStop } from '../types/tour'
import { buildRouteLink } from '../utils/buildRouteLink'
import { drawJourneyMap } from '../utils/drawJourneyMap'

type TourJourneyMapProps = {
  // Only stops that have a map position
  stops: TourStop[]
  tourTitle: string
}

// 'loading' while Google loads, 'ready' when the map is drawn, 'failed' if Google could not load
type MapStatus = 'loading' | 'ready' | 'failed'

// A Google map with every stop of the tour as a numbered pin, joined in order by a dashed line.
// Underneath: a legend and a link that opens the whole route in Google Maps.
export function TourJourneyMap({ stops, tourTitle }: TourJourneyMapProps) {
  const mapBoxRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<MapStatus>('loading')

  // Draw the map once the box is on the page (and again if the stops change)
  useEffect(() => {
    const mapBox = mapBoxRef.current
    if (!mapBox) {
      return
    }

    let isStillShown = true
    drawJourneyMap(mapBox, stops).then((isDrawn) => {
      // Don't update a component that has already left the page
      if (!isStillShown) {
        return
      }
      if (isDrawn) {
        setStatus('ready')
      } else {
        setStatus('failed')
      }
    })

    return () => {
      isStillShown = false
    }
  }, [stops])

  const routeLink = buildRouteLink(stops)

  return (
    <div className="overflow-hidden rounded-[28px] bg-night-raised ring-1 ring-white/10">
      <div className="relative aspect-4/3 sm:aspect-16/10">
        {/* Google draws the map inside this box */}
        <div ref={mapBoxRef} role="region" aria-label={`Map of the ${tourTitle} journey`} className="absolute inset-0" />

        {status === 'loading' && (
          <div className="absolute inset-0 grid place-items-center bg-night-raised">
            <LoaderCircle aria-hidden="true" className="size-6 animate-spin text-white/40" strokeWidth={2} />
            <span className="sr-only">Loading the map…</span>
          </div>
        )}

        {status === 'failed' && (
          <div className="absolute inset-0 isolate grid place-items-center bg-night-raised p-6 text-center">
            <div aria-hidden="true" className="map-grid absolute inset-0 -z-10" />
            <div className="flex flex-col items-center">
              <MapPinned aria-hidden="true" className="size-14 text-white/15" strokeWidth={1} />
              <p className="mt-3 text-sm font-medium text-white/50">The map couldn't load right now.</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-white/60">
          <li className="flex items-center gap-2">
            <span aria-hidden="true" className="size-3 rounded-full bg-accent" />
            Start
          </li>
          <li className="flex items-center gap-2">
            <span aria-hidden="true" className="size-3 rounded-full bg-night ring-2 ring-accent" />
            Stops
          </li>
          <li className="flex items-center gap-2">
            <span aria-hidden="true" className="size-3 rounded-full bg-white" />
            End
          </li>
          <li className="flex items-center gap-2">
            <Car aria-hidden="true" className="size-3.5" strokeWidth={2} />
            Transfer
          </li>
        </ul>

        {routeLink !== '' && (
          <a
            href={routeLink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-accent-bright transition-colors hover:text-white"
          >
            Open route in Google Maps
            <ArrowUpRight aria-hidden="true" className="size-4" strokeWidth={2} />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        )}
      </div>
    </div>
  )
}
