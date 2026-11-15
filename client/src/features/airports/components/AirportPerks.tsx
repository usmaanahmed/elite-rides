import { AIRPORT_PERKS } from '../constants/airportPerks'

// Row of what comes with every airport transfer (flight tracking, meet & greet, fixed fares).
// The thin lines between the boxes come from `gap-px` showing the list's light background through.
export function AirportPerks() {
  return (
    <ul className="grid gap-px overflow-hidden rounded-[28px] bg-white/10 ring-1 ring-white/10 sm:grid-cols-3">
      {AIRPORT_PERKS.map((perk) => {
        const Icon = perk.icon
        return (
          <li key={perk.title} className="flex gap-4 bg-night p-6 sm:flex-col sm:gap-5 lg:flex-row lg:p-7">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5 text-accent">
              <Icon aria-hidden="true" className="size-5" strokeWidth={1.75} />
            </span>
            <div>
              <p className="font-semibold text-white">{perk.title}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-white/55">{perk.description}</p>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
