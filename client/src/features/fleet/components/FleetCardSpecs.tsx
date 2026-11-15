import { Briefcase, Luggage, Users, type LucideIcon } from 'lucide-react'
import type { PublicVehicle } from '../../booking/types/publicApi'

type FleetCardSpecsProps = {
  vehicle: PublicVehicle
}

// Capacity row on a fleet card: passengers, large bags and hand bags
export function FleetCardSpecs({ vehicle }: FleetCardSpecsProps) {
  return (
    <ul className="grid grid-cols-3 gap-3 border-t border-white/10 pt-4">
      <FleetCardSpec icon={Users} value={vehicle.passengerCapacity} label="Passengers" />
      <FleetCardSpec icon={Luggage} value={vehicle.luggageCapacity} label="Large bags" />
      <FleetCardSpec icon={Briefcase} value={vehicle.handLuggageCapacity} label="Hand bags" />
    </ul>
  )
}

type FleetCardSpecProps = {
  icon: LucideIcon
  value: number
  label: string
}

// One capacity: icon and number on one line, small label underneath (read as "3 Passengers")
function FleetCardSpec({ icon: Icon, value, label }: FleetCardSpecProps) {
  return (
    <li>
      <p className="flex items-center gap-2">
        <Icon aria-hidden="true" className="size-4 text-accent" strokeWidth={1.75} />
        <span className="text-lg font-semibold leading-none text-white tabular-nums">{value}</span>
      </p>
      <p className="mt-1.5 text-xs text-white/45">{label}</p>
    </li>
  )
}
