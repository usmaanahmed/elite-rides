import { ArrowRight, Phone } from 'lucide-react'
import { COMPANY } from '../../../shared/constants/company'
import { HeroHighlights } from './HeroHighlights'

// Left side of the hero: headline, short intro, the two call-to-action buttons and the selling points.
// Each block fades up one after another (`[animation-delay:…]` staggers them).
// `short:` / `very-short:` classes make the headline and gaps smaller on short laptop screens.
export function HeroContent() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-[2.75rem] font-semibold leading-[1.04] tracking-[-0.035em] text-white motion-safe:animate-rise-in motion-safe:[animation-delay:80ms] sm:text-6xl xl:text-7xl very-short:text-6xl">
        Arrive in{' '}
        <span className="bg-linear-to-r from-accent-bright to-accent bg-clip-text pr-1 font-display text-[1.12em] font-normal italic tracking-normal text-transparent">
          effortless
        </span>{' '}
        luxury.
      </h1>

      <p className="mt-6 max-w-xl text-base leading-relaxed text-white/65 motion-safe:animate-rise-in motion-safe:[animation-delay:160ms] sm:text-lg short:mt-4">
        Airport transfers, executive travel and hourly chauffeur hire across London and the UK. Fixed upfront
        fares, flight tracking and courteous, professional chauffeurs — every single time.
      </p>

      <div className="mt-9 flex flex-col gap-3 motion-safe:animate-rise-in motion-safe:[animation-delay:240ms] sm:flex-row sm:items-center short:mt-6">
        <a
          href="#quote"
          className="group inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-accent px-7 text-[15px] font-semibold text-white shadow-[0_14px_34px_-12px_rgba(252,98,3,0.8)] transition hover:brightness-95 short:h-12"
        >
          Get an instant quote
          <ArrowRight className="size-4.5 transition-transform group-hover:translate-x-1" strokeWidth={2} />
        </a>
        <a
          href={COMPANY.phoneLink}
          className="inline-flex h-14 items-center justify-center gap-3 rounded-2xl border border-white/15 bg-white/5 pl-3 pr-6 text-[15px] font-semibold text-white backdrop-blur transition hover:border-white/25 hover:bg-white/10 short:h-12"
        >
          <span className="grid size-9 place-items-center rounded-xl bg-white/10">
            <Phone className="size-4 text-accent" strokeWidth={2} />
          </span>
          {COMPANY.phoneDisplay}
        </a>
      </div>

      <div className="motion-safe:animate-rise-in motion-safe:[animation-delay:320ms]">
        <HeroHighlights />
      </div>
    </div>
  )
}
