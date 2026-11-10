import {
  BadgePercent,
  BriefcaseBusiness,
  Luggage,
  PoundSterling,
  Repeat2,
  Route,
  SquarePen,
  Trash2,
  Users,
  type LucideIcon,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { Button } from '../../../shared/components/buttons/Button'
import { IconButton } from '../../../shared/components/buttons/IconButton'
import type { FleetCapacity } from '../types/fleetCapacity'
import type { Vehicle } from '../types/vehicle'
import { formatDiscount } from '../utils/formatDiscount'
import { getRateText } from '../utils/getRateText'
import { CapacityMeter } from './CapacityMeter'
import { VehiclePhoto } from './VehiclePhoto'

type VehicleCardProps = {
  vehicle: Vehicle
  // The biggest capacities in the fleet, so the bars can compare this vehicle with the others
  fleetCapacity: FleetCapacity
  // The buttons at the bottom. Leave them out to hide the buttons,
  // e.g. for the preview card on the empty page.
  onEdit?: (vehicle: Vehicle) => void
  onEditRates?: (vehicle: Vehicle) => void
  onDelete?: (vehicle: Vehicle) => void
}

// One vehicle shown as a card: photo, name, how many people and bags it carries,
// how it's priced, and buttons to edit it
export function VehicleCard({ vehicle, fleetCapacity, onEdit, onEditRates, onDelete }: VehicleCardProps) {
  const rateText = getRateText(vehicle)
  const hasButtons = onEdit || onEditRates || onDelete

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-[0_16px_32px_-20px_rgba(16,24,40,0.25)]">
      <div className="relative">
        <VehiclePhoto name={vehicle.name} imageUrl={vehicle.imageUrl} className="aspect-video border-b border-line" />
        <span className="absolute left-3 top-3 rounded-lg bg-surface/85 px-2 py-1 text-[11px] font-semibold tabular-nums text-muted ring-1 ring-line backdrop-blur-sm">
          TBMS {vehicle.tbmsId}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h3 className="truncate text-base font-semibold text-ink">{vehicle.name}</h3>
        {/* min-h-10 keeps room for two lines, so the cards in a row line up */}
        <p className="mt-1 line-clamp-2 min-h-10 text-sm text-muted" title={vehicle.description}>
          {vehicle.description || 'No description added.'}
        </p>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <CapacityMeter
            icon={Users}
            label="Passengers"
            value={vehicle.passengerCapacity}
            fleetLargest={fleetCapacity.largestPassengerCapacity}
          />
          <CapacityMeter
            icon={Luggage}
            label="Suitcases"
            value={vehicle.luggageCapacity}
            fleetLargest={fleetCapacity.largestLuggageCapacity}
          />
          <CapacityMeter
            icon={BriefcaseBusiness}
            label="Hand bags"
            value={vehicle.handLuggageCapacity}
            fleetLargest={fleetCapacity.largestHandLuggageCapacity}
          />
        </div>

        {/* A small "spec sheet" of how the vehicle is priced */}
        <dl className="mt-4 space-y-2.5 text-sm">
          <SpecRow icon={Route} label="Distance rate">
            {rateText ? (
              <span className="font-medium text-ink">{rateText}</span>
            ) : (
              <span className="font-semibold text-accent-ink">Not set yet</span>
            )}
          </SpecRow>
          <SpecRow icon={BadgePercent} label="One-way discount">
            <DiscountText discountRate={vehicle.discountRate} />
          </SpecRow>
          <SpecRow icon={Repeat2} label="Return discount">
            <DiscountText discountRate={vehicle.returnDiscountRate} />
          </SpecRow>
        </dl>

        {hasButtons && (
          // mt-auto pushes the buttons to the bottom, so they line up across a row of cards
          <div className="mt-auto pt-5">
            <div className="flex items-center gap-2 border-t border-line pt-4">
              {onEdit && (
                <Button variant="secondary" icon={SquarePen} onClick={() => onEdit(vehicle)}>
                  Edit
                </Button>
              )}
              {onEditRates && (
                <Button variant="secondary" icon={PoundSterling} onClick={() => onEditRates(vehicle)}>
                  Rates
                </Button>
              )}
              {onDelete && (
                <IconButton
                  icon={Trash2}
                  label={`Delete ${vehicle.name}`}
                  onClick={() => onDelete(vehicle)}
                  className="ml-auto hover:text-danger"
                />
              )}
            </div>
          </div>
        )}
      </div>
    </article>
  )
}

type SpecRowProps = {
  icon: LucideIcon
  label: string
  // The value shown on the right
  children: ReactNode
}

// One line of the spec sheet: icon and label on the left, value on the right
function SpecRow({ icon: Icon, label, children }: SpecRowProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="flex shrink-0 items-center gap-2 text-muted">
        <Icon className="size-4" strokeWidth={1.75} />
        {label}
      </dt>
      <dd className="min-w-0 truncate text-right">{children}</dd>
    </div>
  )
}

type DiscountTextProps = {
  discountRate: number
}

// "10% off" in orange when there is a discount, "No discount" in grey when there isn't
function DiscountText({ discountRate }: DiscountTextProps) {
  if (discountRate > 0) {
    return <span className="font-semibold text-accent-ink">{formatDiscount(discountRate)}</span>
  }
  return <span className="text-muted">{formatDiscount(discountRate)}</span>
}
