import { getFileUrl } from '../../../shared/api/apiUrl'
import type { Vehicle } from '../types/vehicle'

// The server sends the image as a short path ("/uploads/vehicles/car.jpg").
// This turns it into a full link the <img> tag can load.
export function withFullImageUrl(vehicle: Vehicle): Vehicle {
  return { ...vehicle, imageUrl: getFileUrl(vehicle.imageUrl) }
}
