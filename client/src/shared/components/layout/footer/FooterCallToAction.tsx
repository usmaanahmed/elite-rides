import { ArrowRight, Phone } from 'lucide-react'
import { COMPANY } from '../../../constants/company'

// Big "Ready when you are" card at the top of the footer: heading, short line,
// and the two buttons (instant quote + phone). Wide screens: buttons on the right.
export function FooterCallToAction() {
  return (
    <div className="relative isolate overflow-hidden rounded-[32px] border border-white/10 bg-night-raised px-6 py-12 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.9)] sm:px-10 sm:py-14 lg:px-16 lg:py-16">
      <CallToActionBackground />

      <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
        <div>
          <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-accent-bright">
            <span className="h-px w-8 bg-accent" />
            Book Your Elite Rides
          </p>
          <h2 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-[-0.035em] text-white sm:text-5xl lg:text-6xl">
            Ready when{' '}
            <span className="bg-linear-to-r from-accent-bright to-accent bg-clip-text pr-1 font-display text-[1.12em] font-normal italic tracking-normal text-transparent">
              you
            </span>{' '}
            are.
          </h2>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-white/60">
            Get a fixed fare in seconds, or call our team and we'll take care of every detail, from pickup to
            drop-off.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
          <a
            href="/#quote"
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
      </div>
    </div>
  )
}

// Decoration inside the card: orange glow, blue glow, faint map grid and a curved journey line
function CallToActionBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
      <div className="absolute -right-32 -top-40 size-120 rounded-full bg-accent/20 blur-[120px]" />
      <div className="absolute -bottom-48 -left-32 size-105 rounded-full bg-dusk/15 blur-[120px]" />
      <div className="map-grid absolute inset-0" />

      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1200 400" preserveAspectRatio="xMidYMid slice" fill="none">
        <path
          d="M-20 360 C 260 380, 420 220, 640 250 S 960 120, 1220 40"
          stroke="white"
          strokeOpacity="0.05"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d="M-20 360 C 260 380, 420 220, 640 250 S 960 120, 1220 40"
          stroke="#fc6203"
          strokeOpacity="0.45"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="2 14"
          className="motion-safe:animate-route-flow"
        />
        <circle cx="640" cy="250" r="3.5" fill="white" fillOpacity="0.3" />
      </svg>
    </div>
  )
}
