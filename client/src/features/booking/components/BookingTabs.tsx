import { BOOKING_TABS } from '../constants/bookingTabs'
import type { BookingTab } from '../types/booking'

type BookingTabsProps = {
  activeTab: BookingTab
  onChange: (tab: BookingTab) => void
}

// Two-option switch at the top of the booking card: "Transfer" or "By the hour".
// Same look as the admin panel's SegmentedControl: the chosen tab is a white pill.
export function BookingTabs({ activeTab, onChange }: BookingTabsProps) {
  return (
    <div className="grid grid-cols-2 gap-1 rounded-2xl border border-line bg-surface-muted p-1">
      {BOOKING_TABS.map((tab) => {
        const Icon = tab.icon
        const isActive = tab.value === activeTab

        let stateClasses = 'text-muted hover:text-ink'
        let iconColor = ''
        if (isActive) {
          stateClasses = 'bg-surface text-ink shadow-[0_1px_3px_rgba(16,24,40,0.1)] ring-1 ring-line'
          iconColor = 'text-accent'
        }

        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onChange(tab.value)}
            aria-pressed={isActive}
            className={`flex h-11 items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all ${stateClasses}`}
          >
            <Icon className={`size-4 ${iconColor}`} strokeWidth={2} />
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
