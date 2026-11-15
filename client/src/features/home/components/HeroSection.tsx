import { SiteHeader } from '../../../shared/components/layout/SiteHeader'
import { BookingWidget } from '../../booking/components/BookingWidget'
import { AirportStrip } from './AirportStrip'
import { HeroBackground } from './HeroBackground'
import { HeroContent } from './HeroContent'

// First screen of the website: header, headline on the left, booking card on the right,
// airports strip at the bottom. On phones the booking card moves under the headline.
// `isolate` keeps the background layers (-z-10) inside this section.
// On laptops the hero fills the screen (`lg:min-h-svh`). On short laptop screens the `short:` classes
// here and in the hero parts use less spacing, so the airports strip still shows at the bottom.
export function HeroSection() {
  return (
    <section className="relative isolate flex flex-col overflow-hidden lg:min-h-svh">
      <HeroBackground />
      <SiteHeader />

      <div className="mx-auto grid w-full max-w-7xl flex-1 items-center gap-12 px-4 pb-16 pt-8 sm:px-6 lg:grid-cols-[1fr_420px] lg:gap-14 lg:px-8 lg:pb-20 lg:pt-10 xl:grid-cols-[1fr_460px] xl:gap-24 short:pb-6 short:pt-2">
        <HeroContent />
        <BookingWidget />
      </div>

      <AirportStrip />
    </section>
  )
}
