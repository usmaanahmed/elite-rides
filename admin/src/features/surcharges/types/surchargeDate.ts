// The values exactly as they sit in the Surcharge On Date form.
// The percentage is kept as text while the user types, and turned into
// a real number when the form is saved (see NewSurchargeDate below).
export type SurchargeDateFormValues = {
  surchargePercent: string
  // "YYYY-MM-DD" from the date picker, e.g. "2026-12-25"
  date: string
  // 24-hour "HH:mm" from the time picker, e.g. "06:30"
  fromTime: string
  toTime: string
}

// A surcharge on date ready to be sent to the server
export type NewSurchargeDate = {
  // e.g. 20 means 20% is added to the fare
  surchargePercent: number
  // "YYYY-MM-DD"
  date: string
  // When the surcharge starts and stops applying on that date, as "HH:mm".
  // fromTime can be later than toTime for a window that runs past midnight, e.g. 22:00 to 02:00.
  fromTime: string
  toTime: string
}
