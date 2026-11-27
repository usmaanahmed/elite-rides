import { MapPinned } from 'lucide-react'
import { SectionNotice } from '../../../shared/components/feedback/SectionNotice'
import { usePublicTours } from '../hooks/usePublicTours'
import { TourCard } from './TourCard'

// "Tours" section on the home page (the menu's "Tours" link jumps here with /#tours).
// The tours come from the server: the ones the office manages on the admin panel's "Tours" page.
// The section stays hidden while loading and when there are no tours, so the page has no empty gap.
export function ToursSection() {
  const toursQuery = usePublicTours()

  function retryLoading(): void {
    toursQuery.refetch()
  }

  if (toursQuery.isPending) {
    return null
  }

  if (toursQuery.isError) {
    return (
      <ToursFrame>
        <SectionNotice
          icon={MapPinned}
          title="We couldn't load our tours just now"
          message="Please try again in a moment, or give us a call and we'll arrange your tour."
          onRetry={retryLoading}
        />
      </ToursFrame>
    )
  }

  if (toursQuery.data.length === 0) {
    return null
  }

  return (
    <ToursFrame>
      <ul aria-label="Our tours" className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
        {toursQuery.data.map((tour) => (
          <li key={tour.id}>
            <TourCard tour={tour} />
          </li>
        ))}
      </ul>
    </ToursFrame>
  )
}

type ToursFrameProps = {
  children: React.ReactNode
}

// The section itself: soft background glow, the heading and the content below it
function ToursFrame({ children }: ToursFrameProps) {
  return (
    <section
      id="tours"
      aria-labelledby="tours-heading"
      className="relative isolate overflow-hidden border-t border-white/10 py-24 sm:py-28 lg:py-32"
    >
      {/* Soft glows behind the cards (decoration only) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-56 top-1/4 size-[620px] rounded-full bg-dusk/10 blur-[150px]" />
        <div className="absolute -right-40 bottom-0 size-[520px] rounded-full bg-accent/10 blur-[150px]" />
      </div>

      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
          <div>
            <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-accent-bright">
              <span className="h-px w-8 bg-accent" />
              Elite tours
            </p>
            <h2
              id="tours-heading"
              className="mt-5 max-w-2xl text-4xl font-semibold leading-[1.05] tracking-[-0.035em] text-white sm:text-5xl lg:text-6xl"
            >
              See more, worry less.
            </h2>
          </div>

          <p className="max-w-md text-base leading-relaxed text-white/60 lg:pb-2">
            Choose a tour, pick your vehicle and the day. One fixed price covers your Elite for the whole tour.
          </p>
        </div>

        <div className="mt-14 lg:mt-16">{children}</div>
      </div>
    </section>
  )
}
