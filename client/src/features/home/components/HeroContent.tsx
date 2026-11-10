import { ArrowRight, Phone } from 'lucide-react'
import { COMPANY } from '../../../shared/constants/company'
import { HeroHighlights } from './HeroHighlights'

// Left side of the hero: headline, short intro, the two call-to-action buttons and the selling points.
// Each block fades up one after another (`[animation-delay:…]` staggers them).
export function HeroContent() {
  return (
    <div className="max-w-2xl">
      <p className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 py-1.5 pl-3 pr-4 text-xs font-medium text-white/75 backdrop-blur motion-safe:animate-rise-in sm:text-[13px]">
        {/* Orange "live" dot with a soft pulse */}
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full rounded-full bg-accent opacity-60 motion-safe:animate-ping" />
          <span className="relative inline-flex size-2 rounded-full bg-accent" />
        </span>
        Premium chauffeur service in London
      </p>

      <h1 className="mt-6 text-[2.75rem] font-semibold leading-[1.04] tracking-[-0.035em] text-white motion-safe:animate-rise-in motion-safe:[animation-delay:80ms] sm:text-6xl xl:text-7xl">
        Arrive in{' '}
        <span className="bg-linear-to-r from-accent-bright to-accent bg-clip-text pr-1 font-display text-[1.12em] font-normal italic tracking-normal text-transparent">
          effortless
        </span>{' '}
        luxury.
      </h1>

      <p className="mt-6 max-w-xl text-base leading-relaxed text-white/65 motion-safe:animate-rise-in motion-safe:[animation-delay:160ms] sm:text-lg">
        Airport transfers, executive travel and hourly chauffeur hire across London and the UK. Fixed upfront
        fares, flight tracking and courteous, professional chauffeurs — every single time.
      </p>

      <div className="mt-9 flex flex-col gap-3 motion-safe:animate-rise-in motion-safe:[animation-delay:240ms] sm:flex-row sm:items-center">
        <a
          href="#quote"
          className="group inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-accent px-7 text-[15px] font-semibold text-white shadow-[0_14px_34px_-12px_rgba(252,98,3,0.8)] transition hover:brightness-95"
        >
          Get an instant quote
          <ArrowRight className="size-4.5 transition-transform group-hover:translate-x-1" strokeWidth={2} />
        </a>
        <a
          href={COMPANY.phoneLink}
          className="inline-flex h-14 items-center justify-center gap-3 rounded-2xl border border-white/15 bg-white/5 pl-3 pr-6 text-[15px] font-semibold text-white backdrop-blur transition hover:border-white/25 hover:bg-white/10"
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
