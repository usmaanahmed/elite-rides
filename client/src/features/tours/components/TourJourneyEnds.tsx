import type { TourStop } from '../types/tour'

type TourJourneyEndsProps = {
  stops: TourStop[]
}

type EndRowProps = {
  label: string
  stop: TourStop
}

// One row: "Starts at" / "Ends at", the place name and its address
function EndRow({ label, stop }: EndRowProps) {
  return (
    <div className="min-w-0">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">{label}</p>
      <p className="mt-0.5 truncate text-sm font-semibold text-ink">{stop.place.name}</p>
      {stop.place.address !== '' && stop.place.address !== stop.place.name && (
        <p className="truncate text-xs text-muted">{stop.place.address}</p>
      )}
    </div>
  )
}

// Small block on the booking card: where the tour starts and where it ends, joined by a dashed line.
// Shows nothing when the tour has no itinerary.
export function TourJourneyEnds({ stops }: TourJourneyEndsProps) {
  if (stops.length === 0) {
    return null
  }

  const startStop = stops[0]
  const endStop = stops[stops.length - 1]

  return (
    <div className="flex gap-3 rounded-2xl bg-surface-muted p-4 ring-1 ring-line">
      {/* Start dot, dashed line, end dot (same colours as the map) */}
      <div aria-hidden="true" className="flex flex-col items-center pt-1.5">
        <span className="size-3 rounded-full bg-accent ring-4 ring-accent/15" />
        <span className="my-1 w-px flex-1 border-l-2 border-dashed border-line" />
        <span className="size-3 rounded-full bg-ink ring-4 ring-ink/10" />
      </div>

      <div className="min-w-0 flex-1 space-y-4">
        <EndRow label="Starts at" stop={startStop} />
        <EndRow label="Ends at" stop={endStop} />
      </div>
    </div>
  )
}
