import { Clock3, Route } from 'lucide-react'
import type { BookingTabOption } from '../types/booking'

// Tabs at the top of the booking card
export const BOOKING_TABS: BookingTabOption[] = [
  { value: 'transfer', label: 'Transfer', icon: Route },
  { value: 'hourly', label: 'By the hour', icon: Clock3 },
]
