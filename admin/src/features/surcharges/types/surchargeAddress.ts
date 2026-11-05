// The values exactly as they sit in the Surcharge Address form
export type SurchargeAddressFormValues = {
  address: string
  // 24-hour "HH:mm" from the time picker, e.g. "06:30"
  fromTime: string
  toTime: string
}

// A surcharge address ready to be sent to the server
export type NewSurchargeAddress = {
  // Trimmed, e.g. "Heathrow Airport, Longford TW6"
  address: string
  // When the surcharge starts and stops applying each day, as "HH:mm".
  // fromTime can be later than toTime for a window that runs past midnight, e.g. 22:00 to 06:00.
  fromTime: string
  toTime: string
}
