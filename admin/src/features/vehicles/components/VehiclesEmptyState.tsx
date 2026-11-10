import { CarFront, ImagePlus, Plus, PoundSterling, Users, type LucideIcon } from 'lucide-react'
import { Button } from '../../../shared/components/buttons/Button'
import { PREVIEW_FLEET_CAPACITY, PREVIEW_VEHICLE } from '../constants/previewVehicle'
import { VehicleCard } from './VehicleCard'

type VehiclesEmptyStateProps = {
  onAddVehicle: () => void
}

type SetupStep = {
  icon: LucideIcon
  title: string
  description: string
}

// What the admin sets up for each vehicle, in order
const SETUP_STEPS: SetupStep[] = [
  { icon: ImagePlus, title: 'Name & photo', description: 'What customers see when they pick their ride.' },
  { icon: Users, title: 'Passengers & luggage', description: 'How many people, suitcases and hand bags it fits.' },
  { icon: PoundSterling, title: 'Mileage rates', description: 'The price per mile, set with £ Rates once it’s saved.' },
]

// Shown when there are no vehicles yet: explains what a vehicle is, the steps to add one,
// and a preview card of how a vehicle will look once it's added
export function VehiclesEmptyState({ onAddVehicle }: VehiclesEmptyStateProps) {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
      {/* Soft orange glow in the top-right corner (decoration only) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-32 size-96 rounded-full bg-accent/10 blur-3xl"
      />

      <div className="relative grid items-center gap-12 p-6 sm:p-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-16 xl:px-14">
        {/* Left: what to do */}
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-2.5 py-1 text-xs font-semibold text-accent-ink">
            <CarFront className="size-3.5" strokeWidth={2} />
            Fleet setup
          </span>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-ink sm:text-[28px] sm:leading-tight">
            Build your fleet
          </h2>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted">
            Add each type of vehicle customers can book, from a 4-seat Saloon to a 16-seat Minibus. Customers pick a
            vehicle by how many people and bags it carries, so set its capacity carefully.
          </p>

          <ol className="mt-8 space-y-4">
            {SETUP_STEPS.map((step, index) => {
              const StepIcon = step.icon
              return (
                <li key={step.title} className="flex items-start gap-3.5">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent ring-1 ring-accent/10">
                    <StepIcon className="size-4.5" strokeWidth={1.75} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink">
                      <span className="text-muted">{index + 1}.</span> {step.title}
                    </p>
                    <p className="mt-0.5 text-sm text-muted">{step.description}</p>
                  </div>
                </li>
              )
            })}
          </ol>

          <Button icon={Plus} onClick={onAddVehicle} className="mt-8">
            Add your first vehicle
          </Button>
        </div>

        {/* Right: a preview of a vehicle card. Hidden from screen readers because it's only an example. */}
        <div aria-hidden="true" className="relative mx-auto w-full max-w-88 select-none">
          {/* A tilted, dashed card behind the preview, so it reads as "a fleet of vehicles" */}
          <div className="absolute inset-0 translate-x-4 translate-y-3 rotate-3 rounded-2xl border border-dashed border-line bg-surface-muted/70" />
          <div className="pointer-events-none relative">
            <VehicleCard vehicle={PREVIEW_VEHICLE} fleetCapacity={PREVIEW_FLEET_CAPACITY} />
          </div>
          <span className="absolute -top-3 right-4 rounded-full bg-ink px-2.5 py-1 text-[11px] font-semibold text-canvas shadow-sm">
            Preview
          </span>
        </div>
      </div>
    </section>
  )
}
