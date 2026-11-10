import type { FleetCapacity } from '../types/fleetCapacity'
import type { Vehicle } from '../types/vehicle'

// Finds the smallest and largest capacities in the fleet,
// e.g. "4 to 16 passengers" or "the most luggage any vehicle carries is 8 bags".
export function getFleetCapacity(vehicles: Vehicle[]): FleetCapacity {
  // No vehicles yet, so every number is 0
  if (vehicles.length === 0) {
    return {
      smallestPassengerCapacity: 0,
      largestPassengerCapacity: 0,
      largestLuggageCapacity: 0,
      largestHandLuggageCapacity: 0,
    }
  }

  const passengerCapacities = vehicles.map((vehicle) => vehicle.passengerCapacity)
  const luggageCapacities = vehicles.map((vehicle) => vehicle.luggageCapacity)
  const handLuggageCapacities = vehicles.map((vehicle) => vehicle.handLuggageCapacity)

  return {
    smallestPassengerCapacity: Math.min(...passengerCapacities),
    largestPassengerCapacity: Math.max(...passengerCapacities),
    largestLuggageCapacity: Math.max(...luggageCapacities),
    largestHandLuggageCapacity: Math.max(...handLuggageCapacities),
  }
}
