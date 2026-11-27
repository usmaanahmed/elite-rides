import { ChevronRight, MapPinned } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import { Link, useParams } from 'react-router'
import { SectionNotice } from '../../../shared/components/feedback/SectionNotice'
import { SiteFooter } from '../../../shared/components/layout/footer/SiteFooter'
import { SiteHeader } from '../../../shared/components/layout/SiteHeader'
import { COMPANY } from '../../../shared/constants/company'
import { ROUTES } from '../../../shared/constants/routes'
import { AirportDetailsSkeleton } from '../../airports/components/details/AirportDetailsSkeleton'
import { TourFacts } from '../components/TourFacts'
import { TourGallery } from '../components/TourGallery'
import { TourScheduleForm } from '../components/TourScheduleForm'
import { usePublicTour } from '../hooks/usePublicTours'
import type { PublicTour } from '../types/tour'
import { getStopsWithLocation, getTourStops } from '../utils/getTourStops'

// Page for one tour (/tours/:tourId), opened from the tour cards on the home page.
// Shows the title, photo gallery and description, and lets the customer choose a vehicle, date and time.
export function TourDetailsPage() {
  const params = useParams()
  const tourId = params.tourId || ''

  // Start at the top of the page when opening a tour (also when moving to another tour)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [tourId])

  return (
    <div className="relative isolate min-h-svh overflow-x-clip">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -right-56 -top-56 size-[680px] rounded-full bg-accent/12 blur-[150px]" />
        <div className="absolute -left-56 top-[40%] size-[560px] rounded-full bg-dusk/10 blur-[150px]" />
        <div className="map-grid absolute inset-x-0 top-0 h-[900px]" />
      </div>
      <SiteHeader />
      <main className="mx-auto w-full max-w-[1440px] px-4 pb-24 pt-6 sm:px-6 lg:px-8 lg:pb-32">
        <TourDetailsContent tourId={tourId} />
      </main>
      <SiteFooter />
    </div>
  )
}

type TourDetailsContentProps = {
  tourId: string
}

// Picks what to show: placeholder while loading, a message if the tour can't be found, otherwise the tour
function TourDetailsContent({ tourId }: TourDetailsContentProps) {
  const tourQuery = usePublicTour(tourId)

  if (tourQuery.isPending) {
    return <AirportDetailsSkeleton />
  }

  if (tourQuery.isError) {
    return (
      <div className="mt-10">
        <SectionNotice
          icon={MapPinned}
          title="We couldn't find this tour"
          message="It may have been removed, or the connection dropped. Please try again, or call us and we'll arrange your tour."
          onRetry={() => tourQuery.refetch()}
        />
      </div>
    )
  }

  return <TourDetails tour={tourQuery.data} />
}

type TourDetailsProps = {
  tour: PublicTour
}

// The loaded tour: breadcrumbs, title and quick facts, photo gallery,
// then the description, itinerary (timeline + map), vehicles and date form
function TourDetails({ tour }: TourDetailsProps) {
  // All places of the tour as one numbered list (same numbers in the timeline and on the map)
  const stops = useMemo(() => getTourStops(tour), [tour])
  const stopsOnMap = useMemo(() => getStopsWithLocation(stops), [stops])

  // Browser tab title, e.g. "Windsor tour | Elite Rides"
  useEffect(() => {
    const previousTitle = document.title
    document.title = `${tour.title} | ${COMPANY.name}`
    return () => {
      document.title = previousTitle
    }
  }, [tour.title])

  return (
    <>
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-white/45">
          <li>
            <Link to={ROUTES.home} className="transition-colors hover:text-white">
              Home
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="size-3.5" strokeWidth={2} />
          </li>
          <li>
            <Link to="/#tours" className="transition-colors hover:text-white">
              Tours
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="size-3.5" strokeWidth={2} />
          </li>
          <li aria-current="page" className="truncate font-medium text-white/80">
            {tour.title}
          </li>
        </ol>
      </nav>

      <div className="mt-10 motion-safe:animate-rise-in lg:mt-12">
        <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-accent-bright">
          <span className="h-px w-8 bg-accent" />
          Elite tour
        </p>
        <h1 className="mt-5 text-4xl font-semibold leading-[1.02] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
          {tour.title}
        </h1>
        <div className="mt-8">
          <TourFacts tour={tour} stops={stops} />
        </div>
      </div>

      <div className="mt-10 lg:mt-14">
        <TourGallery tour={tour} />
      </div>

      <div className="mt-16 lg:mt-24">
        <TourScheduleForm tour={tour} stops={stops} stopsOnMap={stopsOnMap} />
      </div>
    </>
  )
}
