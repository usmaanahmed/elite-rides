import { buildDateTime } from './buildDateTime'

// True when the chosen date + time has already gone by, e.g. 09:00 today when it's now 14:00
export function isTimeInPast(date: string, hour: string, minute: string): boolean {
  const chosenTime = buildDateTime(date, hour, minute)
  return chosenTime.getTime() < Date.now()
}
