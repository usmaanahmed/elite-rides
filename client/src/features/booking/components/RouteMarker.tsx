import type { RouteMarkerType } from '../types/booking'

type RouteMarkerProps = {
  type: RouteMarkerType
}

// Shape of each marker: orange ring = pickup, small grey dot = stop, dark square = drop-off
const markerClasses = {
  pickup: 'size-3 rounded-full border-[3px] border-accent bg-surface',
  stop: 'size-2 rounded-full bg-muted',
  dropoff: 'size-3 rounded-[3px] bg-ink',
}

// Small marker on the dotted route line on the left of the route box.
// `left-[25px]` lines it up with the icons in the other fields.
export function RouteMarker({ type }: RouteMarkerProps) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute left-[25px] top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 ${markerClasses[type]}`}
    />
  )
}
