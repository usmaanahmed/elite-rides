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

        let circleClasses = 'border border-white/20 text-white/50'
        let textClasses = 'text-white/50'
        if (isDone) {
          circleClasses = 'bg-accent text-white'
          textClasses = 'text-white/80'
        } else if (isCurrent) {
          circleClasses = 'bg-white text-ink'
          textClasses = 'text-white'
        }

        return (
          <li key={name} className="flex items-center gap-2 sm:gap-3">
            <span className={`grid size-7 place-items-center rounded-full ${circleClasses}`}>
              {isDone ? <Check className="size-3.5" strokeWidth={3} /> : stepNumber}
            </span>
            <span className={textClasses}>{name}</span>
            {stepNumber < STEP_NAMES.length && <span aria-hidden="true" className="h-px w-6 bg-white/20 sm:w-10" />}
          </li>
        )
      })}
    </ol>
  )
}
