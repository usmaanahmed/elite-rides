import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router'
import { ROUTES } from '../../../../shared/constants/routes'

type AirportBreadcrumbsProps = {
  airportName: string
}

// "Home › Airports › Heathrow" trail at the top of the airport page
export function AirportBreadcrumbs({ airportName }: AirportBreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-white/45">
        <li>
          <Link to={ROUTES.home} className="transition-colors hover:text-white">
            Home
          </Link>
        </li>
        <li aria-hidden="true">
          <ChevronRight className="size-3.5" strokeWidth={2} />
        </li>
        <li>
          <Link to="/#airports" className="transition-colors hover:text-white">
            Airports
          </Link>
        </li>
        <li aria-hidden="true">
          <ChevronRight className="size-3.5" strokeWidth={2} />
        </li>
        <li aria-current="page" className="truncate font-medium text-white/80">
          {airportName}
        </li>
      </ol>
    </nav>
  )
}
