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

// The values exactly as they sit in the Edit Vehicle form. Same as the add
// form, plus display order; the image is optional (blank keeps the old one).
export type EditVehicleFormValues = VehicleFormValues & {
  displayOrder: string
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

// A vehicle edit ready to be sent to the server. The image is optional: leave
// it out to keep the vehicle's current photo.
export type VehicleUpdate = Omit<NewVehicle, 'image'> & {
  displayOrder: number
  image?: File
}

// One mileage band, e.g. "1 to 20 miles @ £2.50 per mile"
export type MileageBand = {
  fromMiles: number
  toMiles: number
  ratePerMile: number
}

// One slab band, e.g. "1 to 20 miles = £50 flat"
export type SlabBand = {
  fromMiles: number
  toMiles: number
  price: number
}

// Whether a vehicle's distance fare comes from mileage bands or flat slab bands
export type RateType = 'mileage' | 'slab'

export type CalculationFormatType = 'percent' | 'fixed'

// How much more (or less) a vehicle costs than the base fare
export type CalculationFormat = {
  type: CalculationFormatType
  value: number
}

// The values ready to send to the "£ Rates" endpoint
export type VehicleRates = {
  rateType: RateType
  fixedPrice: number
  hourlyRate: number
  mileageBands: MileageBand[]
  slabBands: SlabBand[]
}

// A band row exactly as it sits in the "£ Rates" form (numbers kept as text while typing)
export type MileageBandFormValues = {
  fromMiles: string
  toMiles: string
  ratePerMile: string
}

export type SlabBandFormValues = {
  fromMiles: string
  toMiles: string
  price: string
}

// The "£ Rates" form's values
export type VehicleRatesFormValues = {
  rateType: RateType
  bandsRequired: boolean
  fixedPrice: string
  hourlyRate: string
  mileageBands: MileageBandFormValues[]
  slabBands: SlabBandFormValues[]
}

// One row in the "Add Calculation Format" modal
export type CalculationFormatItem = {
  vehicleId: string
  type: CalculationFormatType
  value: number
}

// The "Add Calculation Format" form's values, one entry per vehicle (same order as the vehicles list)
export type CalculationFormatFormValues = {
  items: {
    type: CalculationFormatType
    value: string
  }[]
}

// A saved vehicle, as the server sends it back
export type Vehicle = Omit<NewVehicle, 'image'> & {
  id: string
  // The vehicle's ID in TBMS
  tbmsId: string
  // null when the vehicle has no photo
  imageUrl: string | null
  displayOrder: number
  fixedPrice: number
  hourlyRate: number
  rateType: RateType
  mileageBands: MileageBand[]
  slabBands: SlabBand[]
  calculationFormat: CalculationFormat
}
