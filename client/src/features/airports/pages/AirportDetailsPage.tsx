import { PlaneTakeoff } from 'lucide-react'
import { useEffect } from 'react'
import { useParams } from 'react-router'
import { SiteFooter } from '../../../shared/components/layout/footer/SiteFooter'
import { SiteHeader } from '../../../shared/components/layout/SiteHeader'
import { COMPANY } from '../../../shared/constants/company'
import { SectionNotice } from '../../../shared/components/feedback/SectionNotice'
import { AirportAbout } from '../components/details/AirportAbout'
import { AirportBookingCard } from '../components/details/AirportBookingCard'
import { AirportBreadcrumbs } from '../components/details/AirportBreadcrumbs'
import { AirportDetailsSkeleton } from '../components/details/AirportDetailsSkeleton'
import { AirportDetailsTitle } from '../components/details/AirportDetailsTitle'
import { AirportGallery } from '../components/details/AirportGallery'
import { AirportLocation } from '../components/details/AirportLocation'
import { OtherAirports } from '../components/details/OtherAirports'
import { usePublicAirport } from '../hooks/usePublicAirports'
import type { PublicAirport } from '../types/airport'

// Page for one airport (/airports/:airportId), opened from the airport cards on the home page.
// Shows everything the office saved for the airport: name, address, description and all photos.
export function AirportDetailsPage() {
  const params = useParams()
  const airportId = params.airportId || ''

  // Start at the top of the page when opening an airport (also when moving to another airport)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [airportId])

  return (
    <div className="relative isolate min-h-svh overflow-x-clip">
      <AirportDetailsBackground />
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl px-4 pb-24 pt-6 sm:px-6 lg:px-8 lg:pb-32">
        <AirportDetailsContent airportId={airportId} />
      </main>
      <SiteFooter />
    </div>
  )
}

type AirportDetailsContentProps = {
  airportId: string
}

// Picks what to show: placeholder while loading, a message if the airport can't be found,
// otherwise the airport details
function AirportDetailsContent({ airportId }: AirportDetailsContentProps) {
  const airportQuery = usePublicAirport(airportId)

  function retryLoading(): void {
    airportQuery.refetch()
  }

  if (airportQuery.isPending) {
    return <AirportDetailsSkeleton />
  }

  if (airportQuery.isError) {
    return (
      <div className="mt-10">
        <SectionNotice
          icon={PlaneTakeoff}
          title="We couldn't find this airport"
          message="It may have been removed, or the connection dropped. Please try again, or call us and we'll arrange your transfer."
          onRetry={retryLoading}
        />
      </div>
    )
  }

  return <AirportDetails airport={airportQuery.data} />
}

type AirportDetailsProps = {
  airport: PublicAirport
}

// The loaded airport: title, photo gallery, then the description and map on the left
// with the booking card on the right (the card stays in view while scrolling on wide screens)
function AirportDetails({ airport }: AirportDetailsProps) {
  // Browser tab title, e.g. "Heathrow Airport transfers | Elite Rides"
  useEffect(() => {
    const previousTitle = document.title
    document.title = `${airport.name} transfers | ${COMPANY.name}`
    return () => {
      document.title = previousTitle
    }
  }, [airport.name])

  return (
    <>
      <AirportBreadcrumbs airportName={airport.name} />

      <div className="mt-10 lg:mt-12">
        <AirportDetailsTitle airport={airport} />
      </div>

      <div className="mt-10 lg:mt-14">
        <AirportGallery airport={airport} />
      </div>

      <div className="mt-16 grid items-start gap-12 lg:mt-24 lg:grid-cols-[1fr_380px] lg:gap-16 xl:gap-24">
        <div className="min-w-0 space-y-16 lg:space-y-20">
          <AirportAbout airport={airport} />
          <AirportLocation airport={airport} />
        </div>
        <aside className="lg:sticky lg:top-8">
          <AirportBookingCard airportName={airport.name} />
        </aside>
      </div>

      <OtherAirports currentAirportId={airport.id} />
    </>
  )
}

// Decorative layers behind the page (same style as the hero and booking pages)
function AirportDetailsBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute -right-56 -top-56 size-[680px] rounded-full bg-accent/12 blur-[150px]" />
      <div className="absolute -left-56 top-[40%] size-[560px] rounded-full bg-dusk/10 blur-[150px]" />
      <div className="map-grid absolute inset-x-0 top-0 h-[900px]" />
    </div>
  )
}
