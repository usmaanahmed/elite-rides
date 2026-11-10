import type { LucideIcon } from 'lucide-react'

type CapacityMeterProps = {
  icon: LucideIcon
  // e.g. "Passengers"
  label: string
  value: number
  // The largest value of any vehicle in the fleet. The bar is full at this number.
  fleetLargest: number
}

// One capacity tile on a vehicle card, e.g. "4 Passengers", with a small bar
// showing how this vehicle compares with the biggest one in the fleet.
export function CapacityMeter({ icon: Icon, label, value, fleetLargest }: CapacityMeterProps) {
  // How full the bar is, from 0 to 100
  let fillPercent = 0
  if (fleetLargest > 0) {
    fillPercent = (value / fleetLargest) * 100
  }

  return (
    <div className="min-w-0 rounded-xl border border-line bg-surface-muted px-3 py-2.5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xl font-semibold leading-none tabular-nums text-ink">{value}</span>
        <Icon className="size-4 shrink-0 text-accent" strokeWidth={2} />
      </div>
      <p className="mt-1.5 truncate text-[11px] font-medium text-muted">{label}</p>

      {/* aria-hidden: the number above already says the same thing for screen readers */}
      <div aria-hidden="true" className="mt-2 h-1 overflow-hidden rounded-full bg-line">
        <div className="h-full rounded-full bg-accent transition-[width] duration-500" style={{ width: `${fillPercent}%` }} />
      </div>
    </div>
  )
}
