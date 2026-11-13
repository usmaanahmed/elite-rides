import type { SurchargeAmountType, SurchargeStatus } from './surcharge'

// The values exactly as they sit in the Night Surcharge form (the amount stays text while typing)
export type SurchargeNightFormValues = {
  // 24-hour "HH:mm", e.g. "22:00"
  startTime: string
  endTime: string
  amountType: SurchargeAmountType
  amount: string
  status: SurchargeStatus
}

// A night surcharge ready to be sent to the server
export type NewSurchargeNight = {
  // The window can run past midnight, e.g. 22:00 to 06:00
  startTime: string
  endTime: string
  amountType: SurchargeAmountType
  // Pounds when amountType is "fixed", a percentage when it is "percent"
  amount: number
  status: SurchargeStatus
}

// A night surcharge as saved on the server
export type SurchargeNight = NewSurchargeNight & {
  id: string
}
