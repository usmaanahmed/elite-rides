import type { VehicleType } from '../types/vehicle'

// Every vehicle type that can be booked. Pricing forms show one price box per type.
// TODO: load this from the vehicles API once it exists, so vehicles added on the
// Vehicles & Mileage page show up in the pricing forms automatically.
export const VEHICLE_TYPES: VehicleType[] = [
  { id: 'saloon', name: 'Saloon' },
  { id: 'estate', name: 'Estate' },
  { id: 'executive-saloon', name: 'Executive Saloon' },
  { id: 'mpv', name: 'MPV' },
  { id: 'mpv-plus', name: 'MPV Plus' },
  { id: 'minibus-8-seater', name: 'Minibus 8 Seater' },
  { id: 'mpv-12-seater', name: 'MPV 12 Seater' },
  { id: 'green-class', name: 'Green Class' },
  { id: 'mpv-14-seater', name: 'MPV 14 Seater' },
  { id: 'mpv-16-seater', name: 'MPV 16 Seater' },
]

// Looks up a vehicle type's name from its id, e.g. 'mpv-plus' -> 'MPV Plus'
export function getVehicleTypeName(vehicleTypeId: string): string {
  const vehicleType = VEHICLE_TYPES.find((type) => type.id === vehicleTypeId)
  return vehicleType ? vehicleType.name : 'Unknown vehicle'
}
