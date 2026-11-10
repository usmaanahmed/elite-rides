import { CarFront, Luggage, Route, Users } from 'lucide-react'
import { StatCard } from '../../../shared/components/cards/StatCard'
import { formatCount } from '../../../shared/utils/formatNumbers'
import type { FleetCapacity } from '../types/fleetCapacity'
import type { Vehicle } from '../types/vehicle'
import { getFleetCapacity } from '../utils/getFleetCapacity'
import { getRateText } from '../utils/getRateText'

type FleetSummaryProps = {
  vehicles: Vehicle[]
}

// e.g. "4–16", or just "4" when every vehicle has the same number of seats
function getPassengerRangeText(fleetCapacity: FleetCapacity): string {
  const smallest = fleetCapacity.smallestPassengerCapacity
  const largest = fleetCapacity.largestPassengerCapacity

  if (smallest === largest) {
    return String(largest)
  }
  return `${smallest}–${largest}`
}

// Counts the vehicles that already have mileage or slab rates saved
function countVehiclesWithRates(vehicles: Vehicle[]): number {
  let count = 0
  for (const vehicle of vehicles) {
    if (getRateText(vehicle) !== null) {
      count = count + 1
    }
  }
  return count
}

// Four tiles above the vehicles that sum up the whole fleet at a glance
export function FleetSummary({ vehicles }: FleetSummaryProps) {
  const fleetCapacity = getFleetCapacity(vehicles)

  // The vehicles with the most seats and the most luggage space (the first one, if there's a tie)
  const biggestVehicle = vehicles.find((vehicle) => vehicle.passengerCapacity === fleetCapacity.largestPassengerCapacity)
  const roomiestVehicle = vehicles.find((vehicle) => vehicle.luggageCapacity === fleetCapacity.largestLuggageCapacity)

  let biggestVehicleText = ''
  if (biggestVehicle) {
    biggestVehicleText = `${biggestVehicle.name} carries the most people`
  }

  let roomiestVehicleText = ''
  if (roomiestVehicle) {
    roomiestVehicleText = `${roomiestVehicle.name} carries the most luggage`
  }

  const vehiclesWithRates = countVehiclesWithRates(vehicles)
  const vehiclesWithoutRates = vehicles.length - vehiclesWithRates
  let ratesText = 'Every vehicle can be priced'
  if (vehiclesWithoutRates > 0) {
    ratesText = `${vehiclesWithoutRates} still need £ Rates`
  }

  // "1 suitcase", but "0 suitcases" or "3 suitcases"
  let luggageUnit = 'suitcases'
  if (fleetCapacity.largestLuggageCapacity === 1) {
    luggageUnit = 'suitcase'
  }

  return (
    // Two tiles per row on phones, four in one row on wide screens
    <div className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-4">
      <StatCard
        label="Vehicle types"
        value={formatCount(vehicles.length)}
        icon={CarFront}
        caption="Customers choose from these"
      />
      <StatCard
        label="Passenger range"
        value={getPassengerRangeText(fleetCapacity)}
        unit="seats"
        icon={Users}
        caption={biggestVehicleText}
      />
      <StatCard
        label="Most luggage"
        value={formatCount(fleetCapacity.largestLuggageCapacity)}
        unit={luggageUnit}
        icon={Luggage}
        caption={roomiestVehicleText}
      />
      <StatCard
        label="Rates set"
        value={formatCount(vehiclesWithRates)}
        unit={`of ${vehicles.length}`}
        icon={Route}
        caption={ratesText}
      />
    </div>
  )
}
