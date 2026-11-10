import type { LucideIcon } from 'lucide-react'

// The two tabs of the booking card
export type BookingTab = 'transfer' | 'hourly'

export type BookingTabOption = {
  value: BookingTab
  label: string
  icon: LucideIcon
}

// One choice in a dropdown, e.g. { value: '2', label: '2 hours' }
export type SelectOption = {
  value: string
  label: string
}

// Shape of the small marker on the route line: ring = pickup, dot = stop, square = drop-off
export type RouteMarkerType = 'pickup' | 'stop' | 'dropoff'

// A pickup date and time split the way the form stores them
export type PickupTime = {
  date: string // "YYYY-MM-DD"
  hour: string // "00" to "23"
  minute: string // "00" to "55"
}
