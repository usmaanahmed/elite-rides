import { apiFetch } from '../../../shared/api/apiFetch'
import { readJsonResponse } from '../../../shared/api/readJsonResponse'
import type { Vehicle, VehicleRates } from '../types/vehicle'
import { withFullImageUrl } from '../utils/withFullImageUrl'

// Saves a vehicle's mileage/slab bands, fixed price and hourly rate together
export async function updateVehicleRates(vehicleId: string, rates: VehicleRates): Promise<Vehicle> {
  const response = await apiFetch(`/vehicles/${vehicleId}/rates`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(rates),
  })
  const savedVehicle = (await readJsonResponse(response)) as Vehicle
  return withFullImageUrl(savedVehicle)
}
