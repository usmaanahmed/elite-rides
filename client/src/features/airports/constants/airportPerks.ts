import { BadgePoundSterling, Plane, UserRoundCheck } from 'lucide-react'
import type { AirportPerk } from '../types/airport'

// What comes with every airport transfer, shown in a row under the airport cards
export const AIRPORT_PERKS: AirportPerk[] = [
  {
    title: 'Flight tracking',
    description: 'We watch your flight, so your pickup moves with your landing time.',
    icon: Plane,
  },
  {
    title: 'Meet & greet',
    description: 'Add it to your booking and your Elite waits in arrivals with your name.',
    icon: UserRoundCheck,
  },
  {
    title: 'Fixed fares',
    description: 'One price agreed before you book. No meter, no surprises.',
    icon: BadgePoundSterling,
  },
]
