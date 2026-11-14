import { Check } from 'lucide-react'

type BookingStepsProps = {
  // 1 = journey, 2 = vehicle, 3 = details
  currentStep: number
}

const STEP_NAMES = ['Journey', 'Vehicle', 'Details']

// "1 Journey — 2 Vehicle — 3 Details" bar at the top of the booking pages
export function BookingSteps({ currentStep }: BookingStepsProps) {
  return (
    <ol className="flex items-center gap-2 text-xs font-semibold sm:gap-3 sm:text-sm">
      {STEP_NAMES.map((name, index) => {
        const stepNumber = index + 1
        const isDone = stepNumber < currentStep
        const isCurrent = stepNumber === currentStep

        let circleClasses = 'border border-white/15 text-white/45'
        let textClasses = 'text-white/45'
        if (isDone) {
          circleClasses = 'bg-accent text-white shadow-[0_6px_18px_-6px_rgba(252,98,3,0.9)]'
          textClasses = 'text-white/75'
        } else if (isCurrent) {
          circleClasses = 'bg-white text-ink ring-4 ring-white/10'
          textClasses = 'text-white'
        }

        // The line after a finished step is orange, the others are faint
        let lineClasses = 'bg-white/15'
        if (isDone) {
          lineClasses = 'bg-linear-to-r from-accent to-accent/30'
        }

        return (
          <li key={name} className="flex items-center gap-2 sm:gap-3">
            <span className={`grid size-7 place-items-center rounded-full tabular-nums transition ${circleClasses}`}>
              {isDone ? <Check className="size-3.5" strokeWidth={3} /> : stepNumber}
            </span>
            <span className={textClasses}>{name}</span>
            {stepNumber < STEP_NAMES.length && (
              <span aria-hidden="true" className={`h-px w-6 sm:w-14 ${lineClasses}`} />
            )}
          </li>
        )
      })}
    </ol>
  )
}
