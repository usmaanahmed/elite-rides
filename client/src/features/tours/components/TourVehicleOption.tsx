import { Briefcase, CarFront, Check, Luggage, Users } from 'lucide-react'
import type { UseFormRegisterReturn } from 'react-hook-form'
import { getFileUrl } from '../../../shared/api/apiUrl'
import { formatMoney } from '../../../shared/utils/formatMoney'
import type { PublicTourVehicle } from '../types/tour'

type TourVehicleOptionProps = {
  vehicle: PublicTourVehicle
  // register('vehicleId') from the form
  field: UseFormRegisterReturn
}

// One vehicle of the tour as a card you can pick: photo, name, seats, bags, the tour price and a "Select" button.
// The real radio button is hidden (sr-only) but still works with the keyboard and screen readers.
// When the card is picked, `group-has-checked:` styles turn the edge orange and the button into "Selected ✓".
export function TourVehicleOption({ vehicle, field }: TourVehicleOptionProps) {
  return (
    <label className="group relative flex cursor-pointer flex-col gap-4 rounded-3xl border-2 border-transparent bg-surface p-4 text-ink shadow-[0_24px_60px_-32px_rgba(0,0,0,0.7)] transition duration-300 hover:-translate-y-0.5 hover:border-accent/40 has-checked:border-accent has-checked:shadow-[0_24px_60px_-28px_rgba(252,98,3,0.6)] has-focus-visible:ring-4 has-focus-visible:ring-accent/30 sm:flex-row sm:items-center sm:p-5">
      <input type="radio" value={vehicle.vehicleId} className="sr-only" {...field} />

      {/* Vehicle photo on a soft grey panel */}
      <span className="grid h-28 shrink-0 place-items-center rounded-2xl bg-linear-to-br from-surface-muted to-[#eceef2] p-3 transition-colors group-has-checked:from-accent-soft group-has-checked:to-accent-soft sm:h-24 sm:w-40">
        {vehicle.imageUrl ? (
          <img
            src={getFileUrl(vehicle.imageUrl)}
            alt=""
            className="h-full w-full object-contain drop-shadow-[0_10px_14px_rgba(13,16,23,0.18)]"
          />
        ) : (
          <CarFront className="size-10 text-muted/60" strokeWidth={1.25} />
        )}
      </span>

      {/* Name and capacity */}
      <span className="min-w-0 flex-1">
        <span className="block text-lg font-semibold tracking-tight">{vehicle.vehicleName}</span>
        <span className="mt-2 flex flex-wrap gap-2 text-xs font-medium text-ink/80">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-muted px-2.5 py-1 ring-1 ring-line">
            <Users className="size-3.5 text-muted" strokeWidth={2} />
            {vehicle.passengerCapacity}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-muted px-2.5 py-1 ring-1 ring-line">
            <Luggage className="size-3.5 text-muted" strokeWidth={2} />
            {vehicle.luggageCapacity}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-muted px-2.5 py-1 ring-1 ring-line">
            <Briefcase className="size-3.5 text-muted" strokeWidth={2} />
            {vehicle.handLuggageCapacity}
          </span>
        </span>
      </span>

      {/* Price and the Select / Selected button */}
      <span className="flex items-center justify-between gap-4 border-t border-line pt-4 sm:flex-col sm:items-end sm:border-t-0 sm:pt-0">
        <span className="sm:text-right">
          <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Fixed price</span>
          <span className="block text-2xl font-semibold tabular-nums">{formatMoney(vehicle.price)}</span>
        </span>

        <span className="inline-flex h-10 min-w-28 items-center justify-center gap-1.5 rounded-full border border-line px-4 text-sm font-semibold text-ink transition group-hover:border-accent/50 group-has-checked:border-accent group-has-checked:bg-accent group-has-checked:text-white group-has-checked:shadow-[0_10px_24px_-10px_rgba(252,98,3,0.9)]">
          <span className="group-has-checked:hidden">Select</span>
          <span className="hidden items-center gap-1.5 group-has-checked:inline-flex">
            <Check className="size-4" strokeWidth={2.5} />
            Selected
          </span>
        </span>
      </span>
    </label>
  )
}
