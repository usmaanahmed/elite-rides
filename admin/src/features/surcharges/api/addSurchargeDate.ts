import type { NewSurchargeDate } from '../types/surchargeDate'

// Saves a new surcharge on date.
// TODO: replace the fake delay with the real request once the backend endpoint exists, e.g.
//   await axios.post('/surcharge-dates', surchargeDate)
export function addSurchargeDate(surchargeDate: NewSurchargeDate): Promise<NewSurchargeDate> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(surchargeDate), 800)
  })
}
