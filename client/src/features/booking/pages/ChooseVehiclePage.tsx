import { useNavigate } from 'react-router'
import { ROUTES } from '../../../shared/constants/routes'
import { BookingAssurances } from '../components/BookingAssurances'
import { BookingPageLayout } from '../components/BookingPageLayout'
import { JourneySummary } from '../components/JourneySummary'
import { MissingJourneyNotice } from '../components/MissingJourneyNotice'
import { VehicleCardSkeleton } from '../components/VehicleCardSkeleton'
import { VehicleOptionCard } from '../components/VehicleOptionCard'
import { useJourneyQuote, usePublicSettings, usePublicVehicles } from '../hooks/usePublicData'
import type { PublicVehicle, QuoteRequest, VehicleQuote } from '../types/publicApi'
import { loadBookingDraft, saveChosenVehicle } from '../utils/bookingDraftStorage'
import { buildQuoteRequest, NO_EXTRAS } from '../utils/buildQuoteRequest'
import { getPretendPrice } from '../utils/getPretendPrice'

const PAGE_SUBTITLE = 'Fixed fares for your journey, with no surprises. Pick the vehicle that suits you best.'

// Step 2: the price of every vehicle for the customer's journey
export function ChooseVehiclePage() {
  const navigate = useNavigate()
  const draft = loadBookingDraft()

  // Price every vehicle (no extras or coupon yet; those come on the next step)
  let quoteRequest: QuoteRequest | null = null
  if (draft) {
    quoteRequest = buildQuoteRequest(draft.journey, NO_EXTRAS, '', '')
  }
  const quoteQuery = useJourneyQuote(quoteRequest)
  const vehiclesQuery = usePublicVehicles()
  const settingsQuery = usePublicSettings()

  if (!draft) {
    return (
      <BookingPageLayout title="Choose your vehicle" currentStep={2}>
        <MissingJourneyNotice message="Tell us about your journey first, then we'll show you the prices." />
      </BookingPageLayout>
    )
  }

  const journey = draft.journey

  function findVehicle(vehicleId: string): PublicVehicle | undefined {
    if (!vehiclesQuery.data) {
      return undefined
    }
    return vehiclesQuery.data.find((vehicle) => vehicle.id === vehicleId)
  }

  // Why a vehicle can't be chosen: the server's reason, or not enough luggage space
  function getUnavailableReason(vehicleQuote: VehicleQuote): string {
    if (!vehicleQuote.available) {
      return vehicleQuote.unavailableReason
    }
    const vehicle = findVehicle(vehicleQuote.vehicleId)
    if (vehicle && journey.luggage > vehicle.luggageCapacity) {
      return `This vehicle takes up to ${vehicle.luggageCapacity} large bags`
    }
    return ''
  }

  function handleSelect(vehicleId: string): void {
    saveChosenVehicle(vehicleId)
    navigate(ROUTES.bookingDetails)
  }

  // Works out what the vehicle list should show
  function renderVehicles() {
    if (quoteQuery.isPending) {
      return (
        <div className="space-y-4">
          <VehicleCardSkeleton />
          <VehicleCardSkeleton />
          <VehicleCardSkeleton />
        </div>
      )
    }

    if (quoteQuery.isError) {
      return (
        <div className="rounded-3xl bg-surface p-6 text-ink">
          <p className="font-semibold">We couldn't price this journey</p>
          <p className="mt-1 text-sm text-muted">{quoteQuery.error.message}</p>
          <button
            type="button"
            onClick={() => quoteQuery.refetch()}
            className="mt-4 inline-flex h-11 items-center rounded-xl border border-line px-5 text-sm font-semibold transition hover:bg-surface-muted"
          >
            Try again
          </button>
        </div>
      )
    }

    // Vehicles that can be booked first, the rest after
    const availableQuotes: VehicleQuote[] = []
    const unavailableQuotes: VehicleQuote[] = []
    for (const vehicleQuote of quoteQuery.data.vehicles) {
      if (getUnavailableReason(vehicleQuote) === '') {
        availableQuotes.push(vehicleQuote)
      } else {
        unavailableQuotes.push(vehicleQuote)
      }
    }
    const sortedQuotes = [...availableQuotes, ...unavailableQuotes]

    if (sortedQuotes.length === 0) {
      return (
        <div className="rounded-3xl bg-surface p-6 text-sm text-ink">
          No vehicles are available right now. Please call us and we'll be happy to help.
        </div>
      )
    }

    let countLabel = `${availableQuotes.length} vehicles available`
    if (availableQuotes.length === 1) {
      countLabel = '1 vehicle available'
    }

    return (
      <div className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">{countLabel}</p>
        {sortedQuotes.map((vehicleQuote) => {
          let pretendPrice: number | null = null
          if (settingsQuery.data) {
            pretendPrice = getPretendPrice(vehicleQuote.total, settingsQuery.data)
          }
          return (
            <VehicleOptionCard
              key={vehicleQuote.vehicleId}
              vehicle={findVehicle(vehicleQuote.vehicleId)}
              vehicleName={vehicleQuote.vehicleName}
              price={vehicleQuote.total}
              pretendPrice={pretendPrice}
              unavailableReason={getUnavailableReason(vehicleQuote)}
              onSelect={() => handleSelect(vehicleQuote.vehicleId)}
            />
          )
        })}
      </div>
    )
  }

  return (
    <BookingPageLayout title="Choose your vehicle" subtitle={PAGE_SUBTITLE} currentStep={2}>
      <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start lg:gap-8">
        <div className="order-2 lg:order-1">{renderVehicles()}</div>
        <div className="order-1 space-y-4 lg:sticky lg:top-6 lg:order-2">
          <JourneySummary journey={journey} distanceMiles={quoteQuery.data?.distanceMiles} />
          <div className="hidden lg:block">
            <BookingAssurances />
          </div>
        </div>
      </div>
    </BookingPageLayout>
  )
}
