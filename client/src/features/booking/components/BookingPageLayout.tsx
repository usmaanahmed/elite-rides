import type { ReactNode } from 'react'
import { SiteHeader } from '../../../shared/components/layout/SiteHeader'
import { BookingSteps } from './BookingSteps'

type BookingPageLayoutProps = {
  title: string
  // Which booking step this page is (2 = vehicle, 3 = details). Leave out on the thank-you page.
  currentStep?: number
  children: ReactNode
}

// The frame of every booking page: the dark site header, the steps bar and a page title
export function BookingPageLayout({ title, currentStep, children }: BookingPageLayoutProps) {
  return (
    <div className="min-h-svh">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-4 pb-20 pt-4 sm:px-6 lg:px-8">
        {currentStep !== undefined && <BookingSteps currentStep={currentStep} />}
        <h1 className="mt-6 text-2xl font-semibold tracking-tight text-white sm:text-3xl">{title}</h1>
        <div className="mt-6">{children}</div>
      </main>
    </div>
  )
}
