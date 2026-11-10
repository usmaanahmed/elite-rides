import type { FleetCapacity } from '../types/fleetCapacity'
import type { Vehicle } from '../types/vehicle'

// A made-up vehicle, used only for the "Preview" card on the empty Vehicles page
// so the admin can see what a vehicle will look like. It is never saved anywhere.
export const PREVIEW_VEHICLE: Vehicle = {
  id: 'preview',
  tbmsId: '1001',
  name: 'Executive Saloon',
  description: 'Leather seats and extra legroom, ideal for airport and business trips.',
  passengerCapacity: 4,
  luggageCapacity: 3,
  handLuggageCapacity: 2,
  discountRate: 10,
  returnDiscountRate: 5,
  imageUrl: null,
  displayOrder: 1,
  fixedPrice: 0,
  hourlyRate: 0,
  rateType: 'mileage',
  mileageBands: [
    { fromMiles: 1, toMiles: 10, ratePerMile: 2.5 },
    { fromMiles: 10, toMiles: 30, ratePerMile: 2.1 },
    { fromMiles: 30, toMiles: 100, ratePerMile: 1.8 },
  ],
  slabBands: [],
  calculationFormat: { type: 'fixed', value: 0 },
}

// Pretend fleet numbers for the preview card, so its capacity bars look
// part-full, like they would next to a bigger vehicle such as an 8-seater
export const PREVIEW_FLEET_CAPACITY: FleetCapacity = {
  smallestPassengerCapacity: 4,
  largestPassengerCapacity: 8,
  largestLuggageCapacity: 6,
  largestHandLuggageCapacity: 4,
}
