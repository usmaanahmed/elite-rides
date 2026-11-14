import type { JourneyDetails } from '../types/journey'

type JourneyRouteListProps = {
  journey: JourneyDetails
}

type RouteStop = {
  label: string
  address: string
  // Shape of the marker on the line
  markerClasses: string
}

// Builds the list of places in order: pickup, stops on the way, then drop-off
function buildRouteStops(journey: JourneyDetails): RouteStop[] {
  const stops: RouteStop[] = []

  stops.push({
    label: 'Pick-up',
    address: journey.pickup,
    markerClasses: 'size-3 rounded-full border-[3px] border-accent bg-surface',
  })

  for (const stop of journey.via) {
    stops.push({
      label: 'Stop',
      address: stop,
      markerClasses: 'size-2 rounded-full bg-muted',
    })
  }

  if (journey.dropoff) {
    stops.push({
      label: 'Drop-off',
      address: journey.dropoff,
      markerClasses: 'size-3 rounded-[3px] bg-ink',
    })
  }

  return stops
}

// The journey's places shown on a dotted line: orange ring = pickup, grey dot = stop, dark square = drop-off
export function JourneyRouteList({ journey }: JourneyRouteListProps) {
  const stops = buildRouteStops(journey)

  return (
    <ol className="space-y-4">
      {stops.map((stop, index) => {
        const isLast = index === stops.length - 1

        return (
          <li key={index} className="relative pl-7">
            {/* Dotted line down to the next place */}
            {!isLast && (
              <span
                aria-hidden="true"
                className="absolute -bottom-4 left-[5px] top-5 border-l-2 border-dotted border-line"
              />
            )}
            {/* Marker, centred on the line */}
            <span aria-hidden="true" className="absolute left-1.5 top-2 grid size-0 place-items-center">
              <span className={`block shrink-0 ${stop.markerClasses}`} />
            </span>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">{stop.label}</p>
            <p className="mt-0.5 text-sm font-medium leading-snug">{stop.address}</p>
          </li>
        )
      })}
    </ol>
  )
}
