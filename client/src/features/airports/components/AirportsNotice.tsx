import { Phone, PlaneTakeoff, RotateCw } from 'lucide-react'
import { COMPANY } from '../../../shared/constants/company'

type AirportsNoticeProps = {
  title: string
  message: string
  // Shows a "Try again" button when given (e.g. after a loading error)
  onRetry?: () => void
}

// Calm message shown in place of the airport cards when they can't be shown
// (loading failed, or the office hasn't added any airports yet). Always offers the phone number.
export function AirportsNotice({ title, message, onRetry }: AirportsNoticeProps) {
  return (
    <div className="flex flex-col items-center rounded-[28px] border border-white/10 bg-white/[0.03] px-6 py-14 text-center">
      <span className="grid size-14 place-items-center rounded-2xl border border-white/10 bg-white/5 text-accent">
        <PlaneTakeoff className="size-6" strokeWidth={1.5} />
      </span>
      <p className="mt-5 text-lg font-semibold text-white">{title}</p>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-white/55">{message}</p>

      <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 text-sm font-semibold text-white transition hover:border-white/25 hover:bg-white/10"
          >
            <RotateCw className="size-4" strokeWidth={2} />
            Try again
          </button>
        )}
        <a
          href={COMPANY.phoneLink}
          className="inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm font-semibold text-white/75 transition-colors hover:text-white"
        >
          <Phone className="size-4 text-accent" strokeWidth={2} />
          Call {COMPANY.phoneDisplay}
        </a>
      </div>
    </div>
  )
}
