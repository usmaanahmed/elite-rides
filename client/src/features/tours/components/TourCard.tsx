import { ArrowRight, MapPinned } from 'lucide-react'
import { Link } from 'react-router'
import { getFileUrl } from '../../../shared/api/apiUrl'
import { formatMoney } from '../../../shared/utils/formatMoney'
import type { PublicTour } from '../types/tour'
import { buildTourLink } from '../utils/buildTourLink'

type TourCardProps = {
  tour: PublicTour
}

// Background of a tour card: the tour's first photo, or a dark map-style panel if it has no photo yet
function TourCardPhoto({ tour }: TourCardProps) {
  if (tour.imageUrls.length === 0) {
    return (
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-night-raised">
        <div className="map-grid absolute inset-0" />
        <MapPinned
          className="absolute left-1/2 top-[38%] size-24 -translate-x-1/2 -translate-y-1/2 text-white/12"
          strokeWidth={1}
        />
      </div>
    )
  }

  return (
    <img
      src={getFileUrl(tour.imageUrls[0])}
      alt=""
      loading="lazy"
      decoding="async"
      className="absolute inset-0 -z-10 h-full w-full object-cover transition-transform duration-1200 ease-out group-hover:scale-105"
    />
  )
}

// One tour: a tall card with the tour photo behind it, the title, the starting price and a link to the tour page.
// The whole card is one link (the link stretches over the card with `after:absolute after:inset-0`).
export function TourCard({ tour }: TourCardProps) {
  return (
    <article className="group relative isolate flex aspect-4/5 flex-col overflow-hidden rounded-[28px] bg-night-raised shadow-[0_24px_60px_-32px_rgba(0,0,0,0.9)] ring-1 ring-white/10 transition duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(252,98,3,0.45)] hover:ring-white/25 has-focus-visible:ring-2 has-focus-visible:ring-accent">
      <TourCardPhoto tour={tour} />

      {/* Dark fade from the bottom, so the white text is readable on any photo */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-linear-to-t from-night via-night/60 via-45% to-night/20"
      />

      {/* Top of the card: the starting price */}
      <div className="flex justify-end p-5 sm:p-6">
        <span className="inline-flex items-center rounded-full bg-night/45 px-3 py-1.5 text-xs font-semibold text-white ring-1 ring-white/15 backdrop-blur-md">
          From {formatMoney(tour.startingPrice)}
        </span>
      </div>

      {/* Bottom of the card (mt-auto pushes it down): title, description and the link */}
      <div className="mt-auto p-5 sm:p-6">
        <h3 className="text-2xl font-semibold leading-tight tracking-tight text-white sm:text-[1.7rem]">{tour.title}</h3>

        {tour.description && (
          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-white/70">{tour.description}</p>
        )}

        <Link
          to={buildTourLink(tour.id)}
          className="mt-5 flex items-center justify-between border-t border-white/15 pt-4 text-sm font-semibold text-white after:absolute after:inset-0 after:rounded-[28px] focus-visible:outline-none"
        >
          <span>
            View tour
            <span className="sr-only">: {tour.title}</span>
          </span>
          <span className="grid size-10 place-items-center rounded-full bg-white/10 ring-1 ring-white/15 backdrop-blur-md transition duration-500 group-hover:bg-accent group-hover:ring-accent">
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
