import { ArrowRight, MapPin, TrainFront } from 'lucide-react'
import { Link } from 'react-router'
import { getFileUrl } from '../../../shared/api/apiUrl'
import { formatTwoDigits } from '../../fleet/utils/formatTwoDigits'
import type { PublicStation } from '../types/station'

type StationCardProps = {
  station: PublicStation
  // Place in the list, starting at 1 (shown as "01", "02"…)
  position: number
}

// One station card in the carousel: photo on top, then number, name, address and description,
// and a round arrow. The whole card is one link to the booking form, which opens with this
// station's address already filled in as the pickup (the link stretches over the card with
// `after:absolute after:inset-0`). If the office hasn't added a photo yet, a dark box with a train is shown.
export function StationCard({ station, position }: StationCardProps) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[28px] bg-night-raised ring-1 ring-white/10 transition duration-500 hover:ring-white/25">
      <div className="relative aspect-4/3 overflow-hidden">
        {station.imageUrls.length > 0 ? (
          <img
            src={getFileUrl(station.imageUrls[0])}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
          />
        ) : (
          <div aria-hidden="true" className="absolute inset-0 grid place-items-center">
            <div className="map-grid absolute inset-0" />
            <TrainFront className="relative size-10 text-white/20" strokeWidth={1.25} />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40 tabular-nums">
          <span className="text-accent-bright">{formatTwoDigits(position)}</span>
          <span aria-hidden="true" className="h-px w-4 bg-white/20" />
          Station
        </p>
        <h3 className="mt-2 line-clamp-2 text-lg font-semibold tracking-tight text-white sm:text-xl">{station.name}</h3>
        <p className="mt-2 flex items-start gap-1.5 text-sm text-white/55">
          <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-accent-bright" strokeWidth={1.75} />
          <span className="line-clamp-1">{station.address}</span>
        </p>
        {station.description && (
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-white/45">{station.description}</p>
        )}

        <Link
          to="/#quote"
          state={{ pickup: station.address }}
          className="mt-auto flex items-center justify-between pt-6 text-sm font-semibold after:absolute after:inset-0 focus-visible:outline-none"
        >
          <span className="text-white/60 transition-colors group-hover:text-white" aria-hidden="true">
            Book
          </span>
          <span className="sr-only">Book a transfer to or from {station.name}</span>
          <span className="grid size-10 place-items-center rounded-full bg-white/6 text-white ring-1 ring-white/10 transition duration-500 group-hover:bg-accent group-hover:ring-accent">
            <ArrowRight
              aria-hidden="true"
              className="size-4 -rotate-45 transition-transform duration-500 group-hover:rotate-0"
              strokeWidth={2}
            />
          </span>
        </Link>
      </div>
    </article>
  )
}
