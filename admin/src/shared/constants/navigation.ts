import {
  Banknote,
  CalendarClock,
  CalendarPlus,
  Calculator,
  Car,
  Gauge,
  House,
  LifeBuoy,
  List,
  Map,
  MapPin,
  MapPinOff,
  MapPinPlus,
  Moon,
  Settings,
  Tags,
  Ticket,
  TrafficCone,
} from 'lucide-react'
import type { MobileTab, NavItem, NavSection, QuickAction } from '../types/navigation'
import { ROUTES } from './routes'

export const mainNavigation: NavSection[] = [
  {
    title: 'Overview',
    items: [
      { path: ROUTES.dashboard, label: 'Dashboard', icon: Gauge },
      { path: ROUTES.bookings, label: 'Bookings', icon: List },
    ],
  },
  {
    title: 'Addresses',
    items: [
      { path: ROUTES.dropdownAddresses, label: 'Drop down Addresses', icon: MapPin },
      { path: ROUTES.banAddresses, label: 'Ban Addresses', icon: MapPinOff },
      { path: ROUTES.congestionAddresses, label: 'Congestion Addresses', icon: TrafficCone },
    ],
  },
  {
    title: 'Pricing',
    items: [
      { path: ROUTES.vehicles, label: 'Vehicles & Mileage Setting', icon: Car },
      { path: ROUTES.fixedPrices, label: 'Fixed Price Setting', icon: Banknote },
      { path: ROUTES.priceChecker, label: 'Price Checker', icon: Calculator },
    ],
  },
  {
    title: 'Surcharges',
    items: [
      { path: ROUTES.surchargeAddresses, label: 'Surcharge Addresses', icon: Map },
      { path: ROUTES.surchargeDates, label: 'Surcharge On Date', icon: CalendarClock },
      { path: ROUTES.surchargeNight, label: 'Surcharge Night', icon: Moon },
    ],
  },
  {
    title: 'Coupons',
    items: [{ path: ROUTES.coupons, label: 'All Coupons', icon: Ticket }],
  },
]

export const footerNavigation: NavItem[] = [
  { path: ROUTES.settings, label: 'Settings', icon: Settings },
  { path: ROUTES.help, label: 'Help & Support', icon: LifeBuoy },
]

// Tabs in the mobile bottom bar. The bar shows the first two on the left of the
// centre "+" button, and the rest on the right next to the "Menu" button.
export const mobileTabs: MobileTab[] = [
  { path: ROUTES.dashboard, label: 'Home', icon: House, relatedPaths: [] },
  { path: ROUTES.bookings, label: 'Bookings', icon: List, relatedPaths: [] },
  {
    path: ROUTES.vehicles,
    label: 'Pricing',
    icon: Tags,
    relatedPaths: [ROUTES.fixedPrices, ROUTES.priceChecker],
  },
]

// Shortcuts in the sheet that opens from the mobile "+" button
export const quickActions: QuickAction[] = [
  { path: ROUTES.newBooking, label: 'New booking', hint: 'Bookings', icon: CalendarPlus },
  { path: ROUTES.dropdownAddresses, label: 'Dropdown address', hint: 'Addresses', icon: MapPinPlus },
  { path: ROUTES.banAddresses, label: 'Ban address', hint: 'Addresses', icon: MapPinOff },
  { path: ROUTES.congestionAddresses, label: 'Congestion address', hint: 'Addresses', icon: TrafficCone },
  { path: ROUTES.vehicles, label: 'Vehicle', hint: 'Pricing', icon: Car },
  { path: ROUTES.fixedPrices, label: 'Fixed price', hint: 'Pricing', icon: Banknote },
  { path: ROUTES.priceChecker, label: 'Price checker', hint: 'Pricing', icon: Calculator },
  { path: ROUTES.surchargeAddresses, label: 'Surcharge address', hint: 'Surcharges', icon: Map },
  { path: ROUTES.surchargeDates, label: 'Date surcharge', hint: 'Surcharges', icon: CalendarClock },
  { path: ROUTES.surchargeNight, label: 'Night surcharge', hint: 'Surcharges', icon: Moon },
  { path: ROUTES.coupons, label: 'Coupon', hint: 'Coupons', icon: Ticket },
]

// Looks up the label of the page at a URL, e.g. '/bookings' -> 'Bookings'
export function getNavItemLabel(pathname: string): string {
  const allItems: NavItem[] = [...footerNavigation]
  for (const section of mainNavigation) {
    allItems.push(...section.items)
  }

  // Also match sub-pages, so '/bookings/123' still finds the 'Bookings' item.
  // The dashboard ('/') is skipped here because every URL starts with '/'.
  const foundItem = allItems.find(
    (item) => item.path === pathname || (item.path !== ROUTES.dashboard && pathname.startsWith(item.path + '/')),
  )
  return foundItem ? foundItem.label : ''
}
