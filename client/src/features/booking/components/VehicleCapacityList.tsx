import { Briefcase, Luggage, Users } from 'lucide-react'
import type { PublicVehicle } from '../types/publicApi'

type VehicleCapacityListProps = {
  vehicle: PublicVehicle
}

// Same look for every capacity pill
const pillClasses =
  'inline-flex items-center gap-1.5 rounded-full bg-surface-muted px-3 py-1.5 text-xs font-medium text-ink/80 ring-1 ring-line'

// Small pills under the vehicle name: passengers, large bags and hand bags
export function VehicleCapacityList({ vehicle }: VehicleCapacityListProps) {
  return (
    <ul className="mt-4 flex flex-wrap gap-2">
      <li className={pillClasses}>
        <Users className="size-3.5 text-muted" strokeWidth={2} />
        {vehicle.passengerCapacity} passengers
      </li>
      <li className={pillClasses}>
        <Luggage className="size-3.5 text-muted" strokeWidth={2} />
        {vehicle.luggageCapacity} large bags
      </li>
      <li className={pillClasses}>
        <Briefcase className="size-3.5 text-muted" strokeWidth={2} />
        {vehicle.handLuggageCapacity} hand bags
      </li>
    </ul>
  )
}
