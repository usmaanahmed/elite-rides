// The values exactly as they sit in the Add Hourly Rate form.
// The rate is kept as text while the user types and turned into a number when saved.
export type HourlyRateFormValues = {
  // Empty until a vehicle is picked
  vehicleTypeId: string
  ratePerHour: string
}

// An hourly rate ready to be sent to the server
export type NewHourlyRate = {
  vehicleTypeId: string
  // In pounds, e.g. 35.5 means £35.50 per hour
  ratePerHour: number
}
