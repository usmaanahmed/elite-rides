import { usePublicAirports } from '../../../../features/airports/hooks/usePublicAirports'
import type { PublicAirport } from '../../../../features/airports/types/airport'
import { buildAirportLink } from '../../../../features/airports/utils/buildAirportLink'
import type { NavLink } from '../../../types/navigation'
import { FooterLinkColumn } from './FooterLinkColumn'

// How many airports the footer lists before the "All airports" link
const MAX_FOOTER_AIRPORTS = 5

// Footer "Airports" column: the airports the office manages on the admin panel's "Airports" page.
// It uses the same data as the home page's Airports section, so React Query doesn't load it twice.
export function FooterAirportLinks() {
  const airportsQuery = usePublicAirports()
  const links = buildAirportLinks(airportsQuery.data)

  return <FooterLinkColumn title="Airports" links={links} />
}

// The first few airports as links to their own pages, then "All airports".
// While the airports are loading (or if loading failed) only "All airports" is shown.
function buildAirportLinks(airports: PublicAirport[] | undefined): NavLink[] {
  const links: NavLink[] = []

  if (airports) {
    const firstAirports = airports.slice(0, MAX_FOOTER_AIRPORTS)
    for (const airport of firstAirports) {
      links.push({ label: airport.name, href: buildAirportLink(airport.id) })
    }
  }

  links.push({ label: 'All airports', href: '/#airports' })
  return links
}
