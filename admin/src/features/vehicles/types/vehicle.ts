// A kind of vehicle customers can book, e.g. Saloon or MPV
export type VehicleType = {
  id: string
  name: string
}

// The values exactly as they sit in the Add Vehicle form.
// Number fields are kept as text while the user types, and turned into
// real numbers when the form is saved (see NewVehicle below).
export type VehicleFormValues = {
  carName: string
  description: string
  passengerCapacity: string
  luggageCapacity: string
  handLuggageCapacity: string
  discountRate: string
  returnDiscountRate: string
  carImage: File | null
}

// A vehicle ready to be sent to the server
export type NewVehicle = {
  name: string
  description: string
  passengerCapacity: number
  luggageCapacity: number
  handLuggageCapacity: number
  // Percentages, e.g. 10 means 10% off
  discountRate: number
  returnDiscountRate: number
  image: File
}

// A saved vehicle, as the server sends it back
export type Vehicle = Omit<NewVehicle, 'image'> & {
  id: string
  // The vehicle's ID in TBMS
  tbmsId: string
  // null when the vehicle has no photo
  imageUrl: string | null
}
