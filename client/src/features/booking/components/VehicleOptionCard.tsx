import { ArrowRight, CarFront, CircleSlash, Phone } from 'lucide-react'
import { getFileUrl } from '../../../shared/api/apiUrl'
import { COMPANY } from '../../../shared/constants/company'
import { formatMoney } from '../../../shared/utils/formatMoney'
import type { PublicVehicle } from '../types/publicApi'
import { VehicleCapacityList } from './VehicleCapacityList'

type VehicleOptionCardProps = {
  // Photo, seats and luggage space (may be missing while vehicles load)
  vehicle: PublicVehicle | undefined
  vehicleName: string
  price: number
  // Crossed-out "was" price (null = none)
  pretendPrice: number | null
  // Why this vehicle can't be chosen ("" = it can)
  unavailableReason: string
  onSelect: () => void
}

// One vehicle in the list on step 2: photo, name, capacity, and either the price + "Select"
// button, or the reason it can't be booked
export function VehicleOptionCard({
  vehicle,
  vehicleName,
  price,
  pretendPrice,
  unavailableReason,
  onSelect,
}: VehicleOptionCardProps) {
  const isAvailable = unavailableReason === ''

  // Bookable cards lift a little and get an orange edge on hover
  let cardClasses = 'shadow-[0_24px_60px_-32px_rgba(0,0,0,0.7)]'
  if (isAvailable) {
    cardClasses = 'shadow-[0_24px_60px_-32px_rgba(0,0,0,0.7)] hover:-translate-y-0.5 hover:ring-accent/50'
  }

  // Unavailable vehicles get a faded, grey photo
  let imageClasses = 'h-full w-full object-contain drop-shadow-[0_12px_18px_rgba(13,16,23,0.18)]'
  if (!isAvailable) {
    imageClasses = 'h-full w-full object-contain opacity-50 grayscale'
  }

  return (
    <article
      className={`flex flex-col overflow-hidden rounded-3xl bg-surface text-ink ring-1 ring-black/5 transition duration-300 sm:flex-row ${cardClasses}`}
    >
      <div className="relative grid h-44 shrink-0 place-items-center bg-linear-to-br from-surface-muted to-[#eceef2] p-5 sm:h-auto sm:w-56">
        {vehicle && vehicle.imageUrl ? (
          <img src={getFileUrl(vehicle.imageUrl)} alt={vehicleName} className={imageClasses} />
        ) : (
          <CarFront className="size-12 text-muted/60" strokeWidth={1.25} />
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-5 p-5 sm:p-6 md:flex-row md:items-center">
        <div className="min-w-0 flex-1">
          <h3 className={`text-xl font-semibold tracking-tight ${isAvailable ? '' : 'text-ink/60'}`}>{vehicleName}</h3>
          {vehicle && vehicle.description && (
            <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted">{vehicle.description}</p>
          )}
          {vehicle && <VehicleCapacityList vehicle={vehicle} />}
        </div>

        {isAvailable ? (
          <VehiclePriceBlock price={price} pretendPrice={pretendPrice} onSelect={onSelect} />
        ) : (
          <VehicleUnavailableBlock reason={unavailableReason} />
        )}
      </div>
    </article>
  )
}

type VehiclePriceBlockProps = {
  price: number
  pretendPrice: number | null
  onSelect: () => void
}

// Right side of a bookable vehicle: the fare (with savings, if any) and the "Select" button
function VehiclePriceBlock({ price, pretendPrice, onSelect }: VehiclePriceBlockProps) {
  let savings = 0
  if (pretendPrice !== null && pretendPrice > price) {
    savings = pretendPrice - price
  }

  return (
    <div className="flex items-end justify-between gap-4 border-t border-line pt-5 md:w-48 md:shrink-0 md:flex-col md:items-stretch md:border-l md:border-t-0 md:pl-6 md:pt-0">
      <div className="md:text-right">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Fixed fare</p>
        <div className="mt-1 flex items-baseline gap-2 md:justify-end">
          {pretendPrice !== null && savings > 0 && (
            <span className="text-sm text-muted line-through tabular-nums">{formatMoney(pretendPrice)}</span>
          )}
          <span className="text-3xl font-semibold tracking-tight tabular-nums">{formatMoney(price)}</span>
        </div>
        {savings > 0 && (
          <p className="mt-1.5 inline-flex rounded-full bg-accent-soft px-2 py-0.5 text-xs font-semibold text-accent-ink">
            Save {formatMoney(savings)}
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={onSelect}
        className="group inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-accent px-6 text-sm font-semibold text-white shadow-[0_12px_28px_-12px_rgba(252,98,3,0.85)] transition hover:brightness-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/30"
      >
        Select
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
      </button>
    </div>
  )
}

type VehicleUnavailableBlockProps = {
  reason: string
}

// Right side of a vehicle that can't be booked online: the reason and a phone link
function VehicleUnavailableBlock({ reason }: VehicleUnavailableBlockProps) {
  return (
    <div className="flex flex-col items-start gap-2.5 border-t border-line pt-5 md:w-56 md:shrink-0 md:border-l md:border-t-0 md:pl-6 md:pt-0">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-muted px-2.5 py-1 text-xs font-semibold text-muted ring-1 ring-line">
        <CircleSlash className="size-3.5" strokeWidth={2} />
        Not available online
      </span>
      <p className="text-sm leading-snug text-muted">{reason}</p>
      <a
        href={COMPANY.phoneLink}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-ink transition hover:text-ink"
      >
        <Phone className="size-3.5" strokeWidth={2} />
        Call {COMPANY.phoneDisplay}
      </a>
    </div>
  )
}
