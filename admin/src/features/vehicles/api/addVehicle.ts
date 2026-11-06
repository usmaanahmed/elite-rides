import { API_URL } from '../../../shared/api/apiUrl'
import { readJsonResponse } from '../../../shared/api/readJsonResponse'
import type { NewVehicle, Vehicle } from '../types/vehicle'
import { withFullImageUrl } from '../utils/withFullImageUrl'

// Saves a new vehicle and returns it as saved (with its id, TBMS ID and image URL).
// The image means the data has to be sent as FormData instead of JSON.
export async function addVehicle(vehicle: NewVehicle): Promise<Vehicle> {
  const formData = new FormData()
  formData.append('name', vehicle.name)
  formData.append('description', vehicle.description)
  formData.append('passengerCapacity', String(vehicle.passengerCapacity))
  formData.append('luggageCapacity', String(vehicle.luggageCapacity))
  formData.append('handLuggageCapacity', String(vehicle.handLuggageCapacity))
  formData.append('discountRate', String(vehicle.discountRate))
  formData.append('returnDiscountRate', String(vehicle.returnDiscountRate))
  formData.append('image', vehicle.image)

  const response = await fetch(`${API_URL}/vehicles`, { method: 'POST', body: formData })
  const savedVehicle = (await readJsonResponse(response)) as Vehicle
  return withFullImageUrl(savedVehicle)
}
