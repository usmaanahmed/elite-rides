import { ArrowRight, Briefcase, CarFront, Luggage, Users } from 'lucide-react'
import { getFileUrl } from '../../../shared/api/apiUrl'
import { formatMoney } from '../../../shared/utils/formatMoney'
import type { PublicVehicle } from '../types/publicApi'

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

// One vehicle in the list on step 2: photo, name, capacity, price and a "Select" button
export function VehicleOptionCard({
  vehicle,
  vehicleName,
  price,
  pretendPrice,
  unavailableReason,
  onSelect,
}: VehicleOptionCardProps) {
  const isAvailable = unavailableReason === ''

  return (
    <div
      className={`flex flex-col gap-4 rounded-3xl bg-surface p-4 text-ink sm:flex-row sm:items-center sm:p-5 ${isAvailable ? '' : 'opacity-60'}`}
    >
      <div className="grid h-28 shrink-0 place-items-center overflow-hidden rounded-2xl bg-surface-muted sm:w-44">
        {vehicle && vehicle.imageUrl ? (
          <img src={getFileUrl(vehicle.imageUrl)} alt={vehicleName} className="h-full w-full object-contain" />
        ) : (
          <CarFront className="size-10 text-muted" strokeWidth={1.5} />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="text-lg font-semibold">{vehicleName}</h3>
        {vehicle && vehicle.description && <p className="mt-1 text-sm text-muted">{vehicle.description}</p>}
        {vehicle && (
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-muted">
            <span className="flex items-center gap-1.5">
              <Users className="size-4" strokeWidth={2} />
              Up to {vehicle.passengerCapacity}
            </span>
            <span className="flex items-center gap-1.5">
              <Luggage className="size-4" strokeWidth={2} />
              {vehicle.luggageCapacity} large bags
            </span>
            <span className="flex items-center gap-1.5">
              <Briefcase className="size-4" strokeWidth={2} />
              {vehicle.handLuggageCapacity} hand bags
            </span>
          </div>
        )}
        {!isAvailable && <p className="mt-2 text-sm font-medium text-danger">{unavailableReason}</p>}
      </div>

      {isAvailable && (
        <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
          <div className="text-right">
            {pretendPrice !== null && (
              <p className="text-sm text-muted line-through tabular-nums">{formatMoney(pretendPrice)}</p>
            )}
            <p className="text-2xl font-semibold tabular-nums">{formatMoney(price)}</p>
          </div>
          <button
            type="button"
            onClick={onSelect}
            className="group inline-flex h-11 items-center gap-2 rounded-xl bg-accent px-5 text-sm font-semibold text-white transition hover:brightness-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/30"
          >
            Select
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
          </button>
        </div>
      )}
    </div>
  )
}
