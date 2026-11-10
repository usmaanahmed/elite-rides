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

// The night surcharge as sent to and received from the server (there is only one)
export type SurchargeNight = {
  // The window can run past midnight, e.g. 22:00 to 06:00
  startTime: string
  endTime: string
  amountType: SurchargeAmountType
  // Pounds when amountType is "fixed", a percentage when it is "percent"
  amount: number
  status: SurchargeStatus
}
