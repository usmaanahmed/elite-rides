import { BadgePoundSterling, PlaneLanding, ShieldCheck } from 'lucide-react'
import type { Airport, HeroHighlight } from '../types/hero'

// Selling points shown under the hero buttons
export const HERO_HIGHLIGHTS: HeroHighlight[] = [
  {
    title: 'Licensed chauffeurs',
    description: 'Vetted, professional and discreet',
    icon: ShieldCheck,
  },
  {
    title: 'Fixed fares',
    description: 'Know your price before you book',
    icon: BadgePoundSterling,
  },
  {
    title: 'Flight tracking',
    description: 'Pickup timed to your landing',
    icon: PlaneLanding,
  },
]

// Airports listed in the strip at the bottom of the hero
export const AIRPORTS: Airport[] = [
  { name: 'Heathrow', code: 'LHR' },
  { name: 'Gatwick', code: 'LGW' },
  { name: 'Stansted', code: 'STN' },
  { name: 'Luton', code: 'LTN' },
  { name: 'London City', code: 'LCY' },
  { name: 'Southend', code: 'SEN' },
]
