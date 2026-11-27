import { usePublicVehicles } from '../../booking/hooks/usePublicData'
import { FleetCarousel } from './FleetCarousel'
import { FleetHeader } from './FleetHeader'
import { FleetNotice } from './FleetNotice'
import { FleetSkeleton } from './FleetSkeleton'

// Page-width box with the page's side padding (the carousel itself runs the full screen width)
const containerClasses = 'mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8'

// "The fleet" section on the home page (the menu's "Fleet" link jumps here with /#fleet).
// The vehicles come from the server: the ones the office manages on the admin panel's
// "Vehicles & Mileage Setting" page. `isolate` keeps the background glows inside this section.
export function FleetSection() {
  return (
    <section
      id="fleet"
      aria-labelledby="fleet-heading"
      className="relative isolate overflow-hidden border-t border-white/10 py-24 sm:py-28 lg:py-32"
    >
      {/* Soft glows behind the cards (decoration only) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-56 top-1/3 size-[620px] rounded-full bg-accent/10 blur-[150px]" />
        <div className="absolute -right-40 bottom-0 size-[520px] rounded-full bg-dusk/10 blur-[150px]" />
      </div>

      <div className={containerClasses}>
        <FleetHeader />
      </div>

      <div className="mt-14 lg:mt-16">
        <FleetContent />
      </div>
    </section>
  )
}

// Picks what to show under the heading: placeholder cards while loading, a message if something
// went wrong or there are no vehicles, otherwise the carousel
function FleetContent() {
  const vehiclesQuery = usePublicVehicles()

  function retryLoading(): void {
    vehiclesQuery.refetch()
  }

  if (vehiclesQuery.isPending) {
    return <FleetSkeleton />
  }

  if (vehiclesQuery.isError) {
    return (
      <div className={containerClasses}>
        <FleetNotice
          title="We couldn't load our fleet just now"
          message="Please try again in a moment, or give us a call and we'll help you choose the right vehicle."
          onRetry={retryLoading}
        />
      </div>
    )
  }

  if (vehiclesQuery.data.length === 0) {
    return (
      <div className={containerClasses}>
        <FleetNotice
          title="Our fleet is being updated"
          message="Give us a call and we'll match the right vehicle to your journey."
        />
      </div>
    )
  }

  return <FleetCarousel vehicles={vehiclesQuery.data} />
}
