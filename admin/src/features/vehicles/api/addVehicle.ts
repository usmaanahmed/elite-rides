import type { NewVehicle, Vehicle } from '../types/vehicle'

// Saves a new vehicle and returns it as saved (with its id, TBMS ID and image URL).
// TODO: replace the fake delay with the real request once the backend endpoint exists.
// The image means it has to be sent as FormData, e.g.
//   const formData = new FormData()
//   formData.append('name', vehicle.name)
//   formData.append('image', vehicle.image)
//   const response = await axios.post('/vehicles', formData)
//   return response.data
export function addVehicle(vehicle: NewVehicle): Promise<Vehicle> {
  const { image, ...details } = vehicle
  const savedVehicle: Vehicle = {
    ...details,
    id: crypto.randomUUID(),
    // The server will hand out the real TBMS ID
    tbmsId: String(Math.floor(1000 + Math.random() * 9000)),
    // A temporary local link to the picked file; the server will return a hosted URL
    imageUrl: URL.createObjectURL(image),
  }

  return new Promise((resolve) => {
    setTimeout(() => resolve(savedVehicle), 800)
  })
}
