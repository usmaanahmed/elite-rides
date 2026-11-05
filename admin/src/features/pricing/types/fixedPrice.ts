// One price box in the Add Fixed Price form. Prices are kept as text while the
// user types and turned into numbers when the form is saved.
export type VehiclePriceInput = {
  vehicleTypeId: string
  // Blank means this vehicle isn't offered on the route
  amount: string
}

// The values exactly as they sit in the Add Fixed Price form
export type FixedPriceFormValues = {
  pickupPostcode: string
  dropoffPostcode: string
  // One entry per vehicle type, in the same order as VEHICLE_TYPES
  prices: VehiclePriceInput[]
}

// A fixed-price route ready to be sent to the server
export type NewFixedPrice = {
  pickupPostcode: string
  dropoffPostcode: string
  // Only the vehicles that were given a price
  prices: {
    vehicleTypeId: string
    amount: number
  }[]
}
