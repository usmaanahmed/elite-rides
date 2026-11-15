import type { LucideIcon } from 'lucide-react'

// An airport the office has saved on the admin panel's "Airports" page,
// from GET /api/public/airports
export type PublicAirport = {
  id: string
  name: string
  description: string
  address: string
  // e.g. ["/uploads/airports/1700000000-123.jpg"] (use getFileUrl). Can be empty.
  imageUrls: string[]
}

// One airport service point shown under the airport cards, e.g. "Flight tracking"
export type AirportPerk = {
  title: string
  description: string
  icon: LucideIcon
}
