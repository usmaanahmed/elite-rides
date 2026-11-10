import { PlaneTakeoff } from 'lucide-react'
import { AIRPORTS } from '../constants/heroContent'

// Strip along the bottom of the hero listing the London airports we cover
export function AirportStrip() {
  return (
    <div className="relative border-t border-white/10">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 sm:px-6 lg:flex-row lg:items-center lg:gap-10 lg:px-8">
        <p className="flex shrink-0 items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
          <PlaneTakeoff className="size-4 text-accent" strokeWidth={2} />
          Airport transfers
        </p>
        <ul className="flex flex-wrap gap-x-7 gap-y-2">
          {AIRPORTS.map((airport) => (
            <li key={airport.code} className="flex items-baseline gap-1.5 text-sm font-medium text-white/75">
              {airport.name}
              <span className="text-[11px] font-semibold tracking-wider text-white/35">{airport.code}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
