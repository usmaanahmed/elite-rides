import type { SurchargeAmountType, SurchargeStatus } from './surcharge'

// The values exactly as they sit in the Surcharge On Date form (the amount stays text while typing)
export type SurchargeDateFormValues = {
  // "YYYY-MM-DD" from the date picker, e.g. "2026-12-25"
  date: string
  amountType: SurchargeAmountType
  amount: string
  // 24-hour "HH:mm". Both empty = the surcharge applies all day.
  fromTime: string
  toTime: string
  status: SurchargeStatus
}

// A surcharge on date ready to be sent to the server
export type NewSurchargeDate = {
  // "YYYY-MM-DD"
  date: string
  amountType: SurchargeAmountType
  // Pounds when amountType is "fixed", a percentage when it is "percent"
  amount: number
  // Optional time window on that date, as "HH:mm" ("" = all day).
  // fromTime can be later than toTime for a window that runs past midnight.
  fromTime: string
  toTime: string
  status: SurchargeStatus
}

// A surcharge on date as saved on the server
export type SurchargeDate = NewSurchargeDate & {
  id: string
}
