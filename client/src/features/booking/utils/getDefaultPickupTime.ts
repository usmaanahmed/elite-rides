import type { PickupTime } from '../types/booking'
import { formatDateString } from './formatDateString'

// Suggests a pickup two hours from now, on the hour.
// e.g. at 21:37 it gives 23:00 today, and at 23:10 it gives 01:00 tomorrow
// (Date moves to the next day by itself when the hours go past 23).
export function getDefaultPickupTime(): PickupTime {
  const pickup = new Date()
  pickup.setHours(pickup.getHours() + 2, 0, 0, 0)

  return {
    date: formatDateString(pickup),
    hour: String(pickup.getHours()).padStart(2, '0'),
    minute: '00',
  }
}
