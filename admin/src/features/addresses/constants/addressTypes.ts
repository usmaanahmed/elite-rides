import { MapPin, Plane, TrainFront, type LucideIcon } from 'lucide-react'
import type { AddressType } from '../types/dropdownAddress'

// The choices for an address's Type, in the order they are shown
export const ADDRESS_TYPES: { value: AddressType; label: string; icon: LucideIcon }[] = [
  { value: 'address', label: 'Address', icon: MapPin },
  { value: 'airport', label: 'Airport', icon: Plane },
  { value: 'station', label: 'Station', icon: TrainFront },
]
