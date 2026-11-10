import { apiFetch } from '../../../shared/api/apiFetch'
import { readJsonResponse } from '../../../shared/api/readJsonResponse'

// Deletes a vehicle (and its image) from the server
export async function deleteVehicle(vehicleId: string): Promise<void> {
  const response = await apiFetch(`/vehicles/${vehicleId}`, { method: 'DELETE' })
  await readJsonResponse(response)
}
