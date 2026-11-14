import { HERO_HIGHLIGHTS } from '../../home/constants/heroContent'

// The same three selling points as the home page (licensed chauffeurs, fixed fares, flight tracking),
// shown under the journey card so the customer feels safe choosing
export function BookingAssurances() {
  return (
    <ul className="space-y-3 rounded-3xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur">
      {HERO_HIGHLIGHTS.map((highlight) => {
        const Icon = highlight.icon

        return (
          <li key={highlight.title} className="flex items-center gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5 text-accent">
              <Icon className="size-4" strokeWidth={1.75} />
            </span>
            <div>
              <p className="text-sm font-semibold text-white">{highlight.title}</p>
              <p className="text-xs text-white/55">{highlight.description}</p>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
