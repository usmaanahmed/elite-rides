// One price box in the Add Fixed Price form. Prices are kept as text while the
// user types and turned into numbers when the form is saved.
export type VehiclePriceInput = {
  vehicleId: string
  // Blank means this vehicle isn't offered on the route
  amount: string
}

// The values exactly as they sit in the Add Fixed Price form (one route, many vehicles)
export type FixedPriceFormValues = {
  pickupPostcode: string
  dropCode: string
  // One entry per vehicle, in the same order as the vehicles list
  prices: VehiclePriceInput[]
}

// A new fixed-price route ready to be sent to the server
export type NewFixedPrice = {
  pickupPostcode: string
  dropCode: string
  // Only the vehicles that were given a price
  prices: {
    vehicleId: string
    fare: number
  }[]
}

// The values exactly as they sit in the Edit Fixed Price form (a single row)
export type EditFixedPriceFormValues = {
  pickupPostcode: string
  dropCode: string
  vehicleId: string
  amount: string
}

// A single row's edit ready to be sent to the server
export type FixedPriceUpdate = {
  pickupPostcode: string
  dropCode: string
  vehicleId: string
  fare: number
}

// A single fixed-price row as saved on the server: one route, one vehicle, one fare
export type FixedPrice = {
  id: string
  pickupPostcode: string
  dropCode: string
  vehicleId: string
  vehicleName: string
  fare: number
}

// One row of a CSV import that could not be saved
export type ImportRowError = {
  row: number
  message: string
}

// What the server sends back after a CSV import
export type ImportResult = {
  addedCount: number
  errors: ImportRowError[]
}
