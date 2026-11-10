import type { LucideIcon } from 'lucide-react'

// One selling point under the hero buttons, e.g. "Fixed fares"
export type HeroHighlight = {
  title: string
  description: string
  icon: LucideIcon
}

// An airport in the strip at the bottom of the hero
export type Airport = {
  name: string
  code: string
}
