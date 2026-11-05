import type { NewHourlyRate } from '../types/hourlyRate'

// Saves a new hourly rate.
// TODO: replace the fake delay with the real request once the backend endpoint exists, e.g.
//   await axios.post('/hourly-rates', hourlyRate)
export function addHourlyRate(hourlyRate: NewHourlyRate): Promise<NewHourlyRate> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(hourlyRate), 800)
  })
}
