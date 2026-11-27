import { TrainFront } from 'lucide-react'
import { SectionNotice } from '../../../shared/components/feedback/SectionNotice'
import { usePublicStations } from '../hooks/usePublicStations'
import { StationsCarousel } from './StationsCarousel'
import { StationsHeader } from './StationsHeader'
import { StationsSkeleton } from './StationsSkeleton'

// Page-width box with the page's side padding (the carousel itself runs the full screen width)
const containerClasses = 'mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8'

// "Stations" section on the home page (the menu's "Stations" link jumps here with /#stations).
// The stations come from the server: the ones the office manages on the admin panel's
// "Stations" page. Heading on top, a sideways-scrolling carousel of station cards underneath.
export function StationsSection() {
  return (
    <section
      id="stations"
      aria-labelledby="stations-heading"
      className="relative isolate overflow-clip border-t border-white/10 py-24 sm:py-28 lg:py-32"
    >
      {/* Soft glows behind the list (decoration only) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-56 top-0 size-[600px] rounded-full bg-accent/10 blur-[150px]" />
        <div className="absolute -right-48 bottom-0 size-[560px] rounded-full bg-dusk/10 blur-[150px]" />
      </div>

      <div className={containerClasses}>
        <StationsHeader />
      </div>

      <div className="mt-14 lg:mt-16">
        <StationsContent />
      </div>
    </section>
  )
}

// Picks what to show next to the heading: placeholder rows while loading, a message if something
// went wrong or there are no stations, otherwise the list of stations
function StationsContent() {
  const stationsQuery = usePublicStations()

  function retryLoading(): void {
    stationsQuery.refetch()
  }

  if (stationsQuery.isPending) {
    return <StationsSkeleton />
  }

  if (stationsQuery.isError) {
    return (
      <SectionNotice
        icon={TrainFront}
        title="We couldn't load our stations just now"
        message="Please try again in a moment, or give us a call and we'll arrange your station transfer."
        onRetry={retryLoading}
      />
    )
  }

  if (stationsQuery.data.length === 0) {
    return (
      <SectionNotice
        icon={TrainFront}
        title="Station transfers on request"
        message="Give us a call with your train details and we'll arrange your pickup or drop-off."
      />
    )
  }

  return <StationsCarousel stations={stationsQuery.data} />
}
