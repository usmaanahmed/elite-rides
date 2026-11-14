import { CalendarCheck, CarFront, Plane, type LucideIcon } from 'lucide-react'
import loginHeroImage from '../assets/login-hero.webp'
import { LoginBrand } from './LoginBrand'

type HeroHighlight = {
  label: string
  icon: LucideIcon
}

// Small chips under the headline that hint at what the admin panel manages
const HERO_HIGHLIGHTS: HeroHighlight[] = [
  { label: 'Live bookings', icon: CalendarCheck },
  { label: 'Fleet & pricing', icon: CarFront },
  { label: 'Airport transfers', icon: Plane },
]

// The photo side of the login screen.
// Phones: a banner at the top; the form "sheet" slides over its bottom edge.
// Laptops (lg and up): a tall rounded panel on the left with the brand headline.
export function LoginHero() {
  return (
    <section className="relative h-[36dvh] min-h-[240px] shrink-0 overflow-hidden bg-[#0b0b0d] lg:sticky lg:top-3 lg:h-[calc(100dvh-1.5rem)] lg:min-h-[560px] lg:w-[56%] lg:rounded-[28px]">
      {/* Photo: Rolls-Royce Phantom at night, by Chu CHU on Unsplash (free Unsplash License) */}
      <img
        src={loginHeroImage}
        alt=""
        fetchPriority="high"
        className="absolute inset-0 size-full object-cover motion-safe:animate-hero-zoom"
      />

      {/* Dark fades so the white text stays readable on the photo:
          a light one at the top (behind the logo) and a stronger one at the bottom (behind the headline) */}
      <div className="absolute inset-x-0 top-0 h-1/3 bg-linear-to-b from-black/60 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-3/4 bg-linear-to-t from-black/90 via-black/50 to-transparent" />
      {/* Soft brand-orange glow from the bottom-left corner */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(252,98,3,0.3),transparent_55%)]" />

      {/* pb-14 on phones leaves room for the form sheet that overlaps the bottom of the photo */}
      <div className="relative flex h-full flex-col justify-between px-6 pb-14 pt-[calc(env(safe-area-inset-top)+1.5rem)] lg:p-10 xl:p-12">
        <LoginBrand />

        <div className="max-w-xl">
          <p className="hidden items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/70 lg:flex">
            <span className="h-px w-8 bg-[#ff8a3d]" />
            Chauffeur operations
          </p>

          <p className="font-display text-[32px] font-semibold leading-[1.05] text-white lg:mt-5 lg:text-[44px] xl:text-[56px] 2xl:text-[60px]">
            Every journey, <span className="italic text-[#ffb37a]">impeccably</span> orchestrated.
          </p>

          <p className="mt-5 hidden max-w-md text-[15px] leading-relaxed text-white/70 lg:block">
            Bookings, fleet, pricing and surcharges for London&apos;s most discerning passengers, managed from one
            elegant console.
          </p>

          <ul className="mt-8 hidden flex-wrap gap-2.5 lg:flex">
            {HERO_HIGHLIGHTS.map((highlight) => {
              const Icon = highlight.icon
              return (
                <li
                  key={highlight.label}
                  className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-2 text-[13px] font-medium text-white/90 backdrop-blur-md"
                >
                  <Icon className="size-4 text-[#ffb37a]" strokeWidth={2} />
                  {highlight.label}
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
