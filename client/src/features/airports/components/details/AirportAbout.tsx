import type { PublicAirport } from '../../types/airport'

type AirportAboutProps = {
  airport: PublicAirport
}

// "About the airport": the description the office wrote on the admin panel.
// `whitespace-pre-line` keeps the line breaks the office typed.
// If there is no description yet, a short general line is shown instead.
export function AirportAbout({ airport }: AirportAboutProps) {
  let description = airport.description
  if (description === '') {
    description = `Book a fixed-price chauffeur transfer to or from ${airport.name}. Share your flight number and we'll time your pickup to your landing.`
  }

  return (
    <section aria-labelledby="airport-about-heading">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/40">Overview</p>
      <h2
        id="airport-about-heading"
        className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl"
      >
        About the{' '}
        <span className="bg-linear-to-r from-accent-bright to-accent bg-clip-text pr-1 font-display text-[1.12em] font-normal italic tracking-normal text-transparent">
          airport
        </span>
      </h2>
      <p className="mt-6 whitespace-pre-line text-base leading-relaxed text-white/65 sm:text-lg sm:leading-relaxed">
        {description}
      </p>
    </section>
  )
}
