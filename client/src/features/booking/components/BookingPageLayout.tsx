import type { ReactNode } from 'react'
import { SiteHeader } from '../../../shared/components/layout/SiteHeader'
import { BookingSteps } from './BookingSteps'

type BookingPageLayoutProps = {
  title: string
  // Short line under the title (optional)
  subtitle?: string
  // Which booking step this page is (2 = vehicle, 3 = details). Leave out on the thank-you page.
  currentStep?: number
  children: ReactNode
}

// The frame of every booking page: the dark site header, a soft background glow,
// the steps bar and a page title
export function BookingPageLayout({ title, subtitle, currentStep, children }: BookingPageLayoutProps) {
  return (
    <div className="relative isolate min-h-svh">
      <BookingBackground />
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-4 pb-24 pt-6 sm:px-6 lg:px-8">
        {currentStep !== undefined && <BookingSteps currentStep={currentStep} />}
        <div className="mt-8 motion-safe:animate-rise-in">
          <h1 className="text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">{title}</h1>
          {subtitle && <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/60 sm:text-base">{subtitle}</p>}
        </div>
        <div className="mt-8">{children}</div>
      </main>
    </div>
  )
}

// Decorative layers behind the booking pages (same style as the home page hero)
function BookingBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute -right-56 -top-56 size-[640px] rounded-full bg-accent/10 blur-[140px]" />
      <div className="absolute -left-56 top-1/3 size-[560px] rounded-full bg-dusk/10 blur-[140px]" />
      <div className="map-grid absolute inset-0" />
    </div>
  )
}
