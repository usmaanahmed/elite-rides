import type { TourStop } from '../types/tour'
import { getDayDateText } from '../utils/tourDates'

type TourTimelineProps = {
  stops: TourStop[]
  // The day titles, in order (Day 1 first)
  dayTitles: string[]
  // "YYYY-MM-DD" or "" (used to show the date of each day)
  startDate: string
}

type TimelineStopProps = {
  stop: TourStop
  // The last stop of a day has no line going down to the next stop
  isLastOfDay: boolean
}

// The round number on the left of a stop. Same colours as the pins on the map.
function StopNumber({ stop }: { stop: TourStop }) {
  let colourClasses = 'bg-night text-white ring-2 ring-accent'
  if (stop.isStart) {
    colourClasses = 'bg-accent text-white ring-4 ring-accent/20'
  } else if (stop.isEnd) {
    colourClasses = 'bg-white text-night ring-4 ring-white/15'
  }

  return (
    <span
      aria-hidden="true"
      className={`relative z-10 grid size-8 shrink-0 place-items-center rounded-full text-xs font-bold ${colourClasses}`}
    >
      {stop.stopNumber}
    </span>
  )
}

// A small "Start" / "End" label next to the place name
function StopTag({ stop }: { stop: TourStop }) {
  if (stop.isStart) {
    return (
      <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-accent-bright">
        Start
      </span>
    )
  }
  if (stop.isEnd) {
    return (
      <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-white">
        End
      </span>
    )
  }
  return null
}

// One place of the timeline: number on the left (joined by a line), name, address and note on the right
function TimelineStop({ stop, isLastOfDay }: TimelineStopProps) {
  return (
    <li className="relative flex gap-4 pb-7 last:pb-0">
      {/* The line down to the next stop of the same day */}
      {!isLastOfDay && (
        <span aria-hidden="true" className="absolute bottom-0 left-4 top-8 w-px -translate-x-1/2 bg-linear-to-b from-accent/60 to-white/10" />
      )}

      <StopNumber stop={stop} />

      <div className="min-w-0 pt-1">
        <div className="flex flex-wrap items-center gap-2">
          <h4 className="font-semibold text-white">{stop.place.name}</h4>
          <StopTag stop={stop} />
        </div>
        {stop.place.address !== '' && stop.place.address !== stop.place.name && (
          <p className="mt-1 text-sm text-white/45">{stop.place.address}</p>
        )}
        {stop.place.description !== '' && (
          <p className="mt-2 text-sm leading-relaxed text-white/70">{stop.place.description}</p>
        )}
      </div>
    </li>
  )
}

// The tour day by day: each day has a header ("Day 1 · Tue 12 Jan") and its places joined by a line.
// Stops are numbered across the whole tour, so the numbers match the pins on the map.
export function TourTimeline({ stops, dayTitles, startDate }: TourTimelineProps) {
  return (
    <ol className="space-y-5">
      {dayTitles.map((dayTitle, dayIndex) => {
        const dayNumber = dayIndex + 1
        const dayStops = stops.filter((stop) => stop.dayNumber === dayNumber)
        const dayDate = getDayDateText(startDate, dayNumber)

        return (
          <li key={dayNumber} className="rounded-3xl bg-white/[0.03] p-5 ring-1 ring-white/10 sm:p-6">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-bright">Day {dayNumber}</span>
              {dayDate !== '' && <span className="text-xs font-medium text-white/40">{dayDate}</span>}
            </div>
            {dayTitle !== '' && <h3 className="mt-2 text-lg font-semibold tracking-tight text-white">{dayTitle}</h3>}

            <ol className="mt-5">
              {dayStops.map((stop, index) => (
                <TimelineStop key={stop.stopNumber} stop={stop} isLastOfDay={index === dayStops.length - 1} />
              ))}
            </ol>
          </li>
        )
      })}
    </ol>
  )
}
