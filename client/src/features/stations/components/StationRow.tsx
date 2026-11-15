import { ArrowRight, MapPin } from 'lucide-react'
import { formatTwoDigits } from '../../fleet/utils/formatTwoDigits'
import type { PublicStation } from '../types/station'
import { StationThumbnail } from './StationThumbnail'

type StationRowProps = {
  station: PublicStation
  // Place in the list, starting at 1 (shown as "01", "02"…)
  position: number
}

// One station in the list: photo on the left, then number, name, address and description,
// and a round arrow on the right. The whole row is one link to the booking form
// (the link stretches over the row with `after:absolute after:inset-0`).
// On hover a soft panel appears behind the row, the photo zooms and the arrow turns orange.
export function StationRow({ station, position }: StationRowProps) {
  return (
    <article className="group relative isolate grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 py-5 sm:gap-6 sm:py-6">
      {/* Hover panel, a little wider than the row (decoration only) */}
      <div
        aria-hidden="true"
        className="absolute -inset-x-3 inset-y-2 -z-10 rounded-3xl bg-white/[0.035] opacity-0 ring-1 ring-white/10 transition-opacity duration-500 group-hover:opacity-100 group-has-focus-visible:opacity-100 sm:-inset-x-4"
      />

      <StationThumbnail station={station} />

      <div className="min-w-0">
        <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40 tabular-nums">
          <span className="text-accent-bright">{formatTwoDigits(position)}</span>
          <span aria-hidden="true" className="h-px w-4 bg-white/20" />
          Station
        </p>
        <h3 className="mt-2 truncate text-lg font-semibold tracking-tight text-white sm:text-2xl">{station.name}</h3>
        <p className="mt-1.5 flex items-start gap-1.5 text-sm text-white/55">
          <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-accent-bright" strokeWidth={1.75} />
          <span className="line-clamp-1">{station.address}</span>
        </p>
        {/* Description only from the `sm` size, phones keep the row short */}
        {station.description && (
          <p className="mt-2 hidden text-sm leading-relaxed text-white/45 sm:line-clamp-2">{station.description}</p>
        )}
      </div>

      <a
        href="#quote"
        className="flex items-center gap-3 text-sm font-semibold after:absolute after:inset-0 after:rounded-3xl focus-visible:outline-none"
      >
        <span aria-hidden="true" className="hidden text-white/60 transition-colors group-hover:text-white md:inline">
          Book
        </span>
        <span className="sr-only">Book a transfer to or from {station.name}</span>
        <span className="grid size-10 place-items-center rounded-full bg-white/6 text-white ring-1 ring-white/10 transition duration-500 group-hover:bg-accent group-hover:ring-accent sm:size-11">
          <ArrowRight
            aria-hidden="true"
            className="size-4 -rotate-45 transition-transform duration-500 group-hover:rotate-0"
            strokeWidth={2}
          />
        </span>
      </a>
    </article>
  )
}
