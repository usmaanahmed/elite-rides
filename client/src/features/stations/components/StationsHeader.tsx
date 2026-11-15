import { ArrowRight, Phone } from 'lucide-react'
import { COMPANY } from '../../../shared/constants/company'

// Left side of the stations section: small "Rail transfers" label, big heading, short intro
// and two buttons (booking form and phone). On wide screens it stays in view while the
// list of stations scrolls past.
export function StationsHeader() {
  return (
    <div>
      <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-accent-bright">
        <span className="h-px w-8 bg-accent" />
        Rail transfers
      </p>
      <h2
        id="stations-heading"
        className="mt-5 text-4xl font-semibold leading-[1.05] tracking-[-0.035em] text-white sm:text-5xl lg:text-[3.5rem]"
      >
        Off the train,{' '}
        <span className="bg-linear-to-r from-accent-bright to-accent bg-clip-text pr-1 font-display text-[1.12em] font-normal italic tracking-normal text-transparent">
          into
        </span>{' '}
        the car.
      </h2>
      <p className="mt-6 max-w-md text-base leading-relaxed text-white/60">
        Fixed-price chauffeur transfers to and from the stations listed here. Add meet & greet and your chauffeur
        will be waiting for you when you arrive.
      </p>

      <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
        <a
          href="#quote"
          className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-accent px-6 text-sm font-semibold text-white shadow-[0_14px_34px_-12px_rgba(252,98,3,0.7)] transition hover:bg-accent-bright"
        >
          Get a fixed price
          <ArrowRight
            aria-hidden="true"
            className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
            strokeWidth={2}
          />
        </a>
        <a
          href={COMPANY.phoneLink}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold text-white/75 transition-colors hover:text-white"
        >
          <Phone aria-hidden="true" className="size-4 text-accent" strokeWidth={2} />
          {COMPANY.phoneDisplay}
        </a>
      </div>
    </div>
  )
}
