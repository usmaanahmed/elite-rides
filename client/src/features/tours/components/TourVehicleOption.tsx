import { Briefcase, CarFront, Luggage, Users } from 'lucide-react'
import type { UseFormRegisterReturn } from 'react-hook-form'
import { getFileUrl } from '../../../shared/api/apiUrl'
import { formatMoney } from '../../../shared/utils/formatMoney'
import type { PublicTourVehicle } from '../types/tour'

type TourVehicleOptionProps = {
  vehicle: PublicTourVehicle
  // register('vehicleId') from the form
  field: UseFormRegisterReturn
}

// One vehicle of the tour as a card you can pick (a radio button): photo, name, seats, bags and the tour price
export function TourVehicleOption({ vehicle, field }: TourVehicleOptionProps) {
  return (
    <label className="flex cursor-pointer items-center gap-4 rounded-3xl border border-line bg-surface p-4 text-ink transition has-checked:border-accent has-checked:bg-accent-soft has-focus-visible:ring-4 has-focus-visible:ring-accent/20 sm:p-5">
      <input type="radio" value={vehicle.vehicleId} className="size-4 shrink-0 accent-accent" {...field} />

      <span className="grid h-16 w-24 shrink-0 place-items-center sm:h-20 sm:w-32">
        {vehicle.imageUrl ? (
          <img src={getFileUrl(vehicle.imageUrl)} alt="" className="h-full w-full object-contain" />
        ) : (
          <CarFront className="size-10 text-muted/60" strokeWidth={1.25} />
        )}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-base font-semibold">{vehicle.vehicleName}</span>
        <span className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted">
          <span className="inline-flex items-center gap-1">
            <Users className="size-3.5" strokeWidth={2} />
            {vehicle.passengerCapacity}
          </span>
          <span className="inline-flex items-center gap-1">
            <Luggage className="size-3.5" strokeWidth={2} />
            {vehicle.luggageCapacity}
          </span>
          <span className="inline-flex items-center gap-1">
            <Briefcase className="size-3.5" strokeWidth={2} />
            {vehicle.handLuggageCapacity}
          </span>
        </span>
      </span>

      <span className="shrink-0 text-right">
        <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Fixed price</span>
        <span className="block text-xl font-semibold tabular-nums sm:text-2xl">{formatMoney(vehicle.price)}</span>
      </span>
    </label>
  )
}
