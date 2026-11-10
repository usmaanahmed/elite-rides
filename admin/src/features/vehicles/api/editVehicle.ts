import { apiFetch } from '../../../shared/api/apiFetch'
import { readJsonResponse } from '../../../shared/api/readJsonResponse'
import type { Vehicle, VehicleUpdate } from '../types/vehicle'
import { withFullImageUrl } from '../utils/withFullImageUrl'

// Saves changes to an existing vehicle. The image is only sent when a new one was chosen.
export async function editVehicle(vehicleId: string, vehicle: VehicleUpdate): Promise<Vehicle> {
  const formData = new FormData()
  formData.append('name', vehicle.name)
  formData.append('description', vehicle.description)
  formData.append('passengerCapacity', String(vehicle.passengerCapacity))
  formData.append('luggageCapacity', String(vehicle.luggageCapacity))
  formData.append('handLuggageCapacity', String(vehicle.handLuggageCapacity))
  formData.append('discountRate', String(vehicle.discountRate))
  formData.append('returnDiscountRate', String(vehicle.returnDiscountRate))
  formData.append('displayOrder', String(vehicle.displayOrder))
  if (vehicle.image) {
    formData.append('image', vehicle.image)
  }

  const response = await apiFetch(`/vehicles/${vehicleId}`, { method: 'PUT', body: formData })
  const savedVehicle = (await readJsonResponse(response)) as Vehicle
  return withFullImageUrl(savedVehicle)
}
