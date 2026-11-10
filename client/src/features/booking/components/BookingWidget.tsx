import { LockKeyhole } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { ROUTES } from '../../../shared/constants/routes'
import { DEFAULT_MAX_PASSENGERS } from '../constants/bookingOptions'
import { usePublicSettings } from '../hooks/usePublicData'
import type { HourlyFormValues } from '../schemas/hourlyFormSchema'
import type { TransferFormValues } from '../schemas/transferFormSchema'
import type { BookingTab } from '../types/booking'
import { loadBookingDraft, saveJourney } from '../utils/bookingDraftStorage'
import { buildHourlyJourney, buildTransferJourney } from '../utils/buildJourney'
import { BookingTabs } from './BookingTabs'
import { HourlyForm } from './HourlyForm'
import { TransferForm } from './TransferForm'

// The booking card on the right of the hero: tabs + the form for the chosen tab.
// Submitting saves the journey and opens step 2 (choose a vehicle with prices).
export function BookingWidget() {
  const navigate = useNavigate()
  const settingsQuery = usePublicSettings()
  // The journey entered before, so "Change" brings the customer back to a filled-in form
  const [savedJourney] = useState(() => {
    const draft = loadBookingDraft()
    return draft ? draft.journey : null
  })
  const [activeTab, setActiveTab] = useState<BookingTab>(() => {
    if (savedJourney && savedJourney.tripType === 'hourly') {
      return 'hourly'
    }
    return 'transfer'
  })

  // Admin settings decide the passenger limit and whether hourly hire is offered
  let maxPassengers = DEFAULT_MAX_PASSENGERS
  let isHourlyAvailable = false
  if (settingsQuery.data) {
    maxPassengers = settingsQuery.data.maxPassengers
    isHourlyAvailable = settingsQuery.data.hourlyRateStatus
  }

  // If hourly hire is switched off, the Transfer form is the only one
  let visibleTab = activeTab
  if (!isHourlyAvailable) {
    visibleTab = 'transfer'
  }

  function handleTransferSubmit(values: TransferFormValues): void {
    saveJourney(buildTransferJourney(values))
    navigate(ROUTES.chooseVehicle)
  }

  function handleHourlySubmit(values: HourlyFormValues): void {
    saveJourney(buildHourlyJourney(values))
    navigate(ROUTES.chooseVehicle)
  }

  return (
    <div id="quote" className="relative w-full max-w-xl scroll-mt-6 lg:max-w-none">
      {/* Soft orange glow behind the card */}
      <div aria-hidden="true" className="absolute -inset-6 rounded-[44px] bg-accent/10 blur-3xl" />

      {/* p-4 on phones gives the fields a little more room; sm:p-7 from tablets up */}
      <div className="relative rounded-[28px] bg-surface p-4 text-ink shadow-[0_40px_100px_-30px_rgba(0,0,0,0.9)] ring-1 ring-white/10 sm:p-7">
        <div className="mb-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-ink">Instant quote</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-ink">Book your chauffeur</h2>
        </div>

        {isHourlyAvailable && <BookingTabs activeTab={visibleTab} onChange={setActiveTab} />}

        {/* Both forms stay mounted (just hidden), so typed details aren't lost when switching tabs */}
        <div className={isHourlyAvailable ? 'mt-4' : ''}>
          <div hidden={visibleTab !== 'transfer'}>
            <TransferForm onSubmit={handleTransferSubmit} maxPassengers={maxPassengers} savedJourney={savedJourney} />
          </div>
          {isHourlyAvailable && (
            <div hidden={visibleTab !== 'hourly'}>
              <HourlyForm onSubmit={handleHourlySubmit} maxPassengers={maxPassengers} savedJourney={savedJourney} />
            </div>
          )}
        </div>

        <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted">
          <LockKeyhole className="size-3.5" strokeWidth={2} />
          No payment needed to see prices
        </p>
      </div>
    </div>
  )
}
