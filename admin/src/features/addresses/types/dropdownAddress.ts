// What kind of place an address is. Airports and stations are grouped separately in the booking form.
export type AddressType = 'address' | 'airport' | 'station'

// The values exactly as they sit in the Add Address form. Charges are kept as
// text while the user types and turned into numbers when the form is saved.
export type DropdownAddressFormValues = {
  address: string
  comparableValue: string
  pickupCharge: string
  dropoffCharge: string
  type: AddressType
}

// A drop down address ready to be sent to the server
export type NewDropdownAddress = {
  address: string
  comparableValue: string
  // Extra charges in pounds added to journeys that start or end here
  pickupCharge: number
  dropoffCharge: number
  type: AddressType
}

// A drop down address as saved on the server
export type DropdownAddress = {
  id: string
  address: string
  comparableValue: string
  pickupCharge: number
  dropoffCharge: number
  type: AddressType
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
