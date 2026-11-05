import type { LucideIcon } from 'lucide-react'

export type NavItem = {
  path: string
  label: string
  icon: LucideIcon
  badge?: string | number
}

export type NavSection = {
  title: string
  items: NavItem[]
}

// A tab in the mobile bottom navigation bar
export type MobileTab = {
  path: string
  label: string
  icon: LucideIcon
  // Other pages that should also highlight this tab, e.g. every pricing page highlights "Pricing"
  relatedPaths: string[]
}

// A shortcut shown in the mobile "Create" bottom sheet
export type QuickAction = {
  path: string
  label: string
  // Short grey text under the label, e.g. "Pricing"
  hint: string
  icon: LucideIcon
}
