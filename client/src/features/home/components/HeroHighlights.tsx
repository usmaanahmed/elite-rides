import { HERO_HIGHLIGHTS } from '../constants/heroContent'

// Three selling points under the hero buttons.
// Phones: icon above a short title. Tablets and wide screens: icon beside title + description.
// Small laptops (lg) have the booking card beside the text, so the columns are narrow: icon goes back on top.
export function HeroHighlights() {
  return (
    <ul className="mt-12 grid grid-cols-3 gap-4 border-t border-white/10 pt-8 sm:gap-6">
      {HERO_HIGHLIGHTS.map((highlight) => {
        const Icon = highlight.icon

        return (
          <li key={highlight.title} className="flex flex-col gap-3 sm:flex-row sm:items-start lg:flex-col xl:flex-row">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5 text-accent">
              <Icon className="size-4.5" strokeWidth={1.75} />
            </span>
            <div>
              <p className="text-sm font-semibold leading-snug text-white">{highlight.title}</p>
              <p className="mt-1 hidden text-[13px] leading-snug text-white/55 sm:block">{highlight.description}</p>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
