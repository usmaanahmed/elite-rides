// The smallest and largest capacities across all vehicles in the fleet.
// The capacity bars on each vehicle card are drawn against the largest numbers.
export type FleetCapacity = {
  smallestPassengerCapacity: number
  largestPassengerCapacity: number
  largestLuggageCapacity: number
  largestHandLuggageCapacity: number
}
