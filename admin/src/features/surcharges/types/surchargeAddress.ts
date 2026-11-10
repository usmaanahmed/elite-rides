import type { SurchargeStatus } from './surcharge'

// The values exactly as they sit in the Surcharge Address form (the price stays text while typing)
export type SurchargeAddressFormValues = {
  address: string
  // 24-hour "HH:mm" from the time picker, e.g. "06:30"
  fromTime: string
  toTime: string
  price: string
  status: SurchargeStatus
}

// A surcharge address ready to be sent to the server
export type NewSurchargeAddress = {
  // Trimmed, e.g. "Heathrow"
  address: string
  // When the surcharge applies each day, as "HH:mm".
  // fromTime can be later than toTime for a window that runs past midnight, e.g. 22:00 to 06:00.
  fromTime: string
  toTime: string
  // Extra charge in pounds
  price: number
  status: SurchargeStatus
}

// A surcharge address as saved on the server
export type SurchargeAddress = NewSurchargeAddress & {
  id: string
}
