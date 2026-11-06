import { API_URL } from '../../../shared/api/apiUrl'
import { readJsonResponse } from '../../../shared/api/readJsonResponse'

// Deletes a vehicle (and its image) from the server
export async function deleteVehicle(vehicleId: string): Promise<void> {
  const response = await fetch(`${API_URL}/vehicles/${vehicleId}`, { method: 'DELETE' })
  await readJsonResponse(response)
}
