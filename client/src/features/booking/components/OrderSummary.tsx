import type { JourneyDetails } from '../types/journey'
import type { VehicleQuote } from '../types/publicApi'
import { JourneySummary } from './JourneySummary'
import { PriceBreakdown } from './PriceBreakdown'

type OrderSummaryProps = {
  journey: JourneyDetails
  distanceMiles: number | undefined
  // The price of the chosen vehicle (undefined while it loads)
  vehicleQuote: VehicleQuote | undefined
  isUpdating: boolean
  // Why the price couldn't be worked out ("" = no problem)
  errorMessage: string
}

// The right-hand column of the details page: the journey and the live price of the chosen vehicle
export function OrderSummary({ journey, distanceMiles, vehicleQuote, isUpdating, errorMessage }: OrderSummaryProps) {
  function renderPrice() {
    if (errorMessage) {
      return <p className="text-sm font-medium text-danger">{errorMessage}</p>
    }
    if (!vehicleQuote) {
      return <div className="h-32 animate-pulse rounded-2xl bg-surface-muted" />
    }
    if (!vehicleQuote.available) {
      return <p className="text-sm font-medium text-danger">{vehicleQuote.unavailableReason}</p>
    }
    return <PriceBreakdown lines={vehicleQuote.lines} total={vehicleQuote.total} />
  }

  return (
    <div className="space-y-4">
      <div className="rounded-3xl bg-surface p-5 text-ink sm:p-6">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-ink">Your price</p>
          {isUpdating && <p className="text-xs text-muted">Updating…</p>}
        </div>
        {vehicleQuote && <p className="mt-1 text-lg font-semibold">{vehicleQuote.vehicleName}</p>}
        <div className={`mt-3 transition-opacity ${isUpdating ? 'opacity-60' : ''}`}>{renderPrice()}</div>
      </div>
      <JourneySummary journey={journey} distanceMiles={distanceMiles} />
    </div>
  )
}
