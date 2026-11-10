import type { LucideIcon } from 'lucide-react'
import { Sparkline } from '../charts/Sparkline'
import { TrendBadge } from '../feedback/TrendBadge'

type StatCardProps = {
  label: string
  // Already formatted, e.g. "£48,210" or "1,284"
  value: string
  // Optional small grey word after the value, e.g. "seats" in "4–16 seats"
  unit?: string
  icon: LucideIcon
  // Change against the previous period as a fraction, e.g. 0.124 means +12.4%
  change?: number
  // Set to false for numbers where going down is good, e.g. cancellations
  isUpGood?: boolean
  // Small grey line at the bottom, e.g. "vs previous 30 days"
  caption?: string
  // Values for the small trend line along the bottom edge, oldest first
  trend?: number[]
}

// A compact summary tile used for every stat in the app (dashboard, vehicles page, ...).
//
//   Label            [icon]
//   1,284
//   +12.4%  vs previous 30 days
//   ~~~~~~ trend line ~~~~~~
export function StatCard({ label, value, unit, icon: Icon, change, isUpGood = true, caption, trend }: StatCardProps) {
  // On phones the trend badge fills the bottom line, so the caption beside it
  // only shows from the `sm` screen size up. Without a badge it always shows.
  let captionClassName = 'min-w-0 truncate'
  if (change !== undefined) {
    captionClassName = 'hidden min-w-0 truncate sm:block'
  }

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-line bg-surface p-3.5 shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-[0_16px_32px_-20px_rgba(16,24,40,0.25)] sm:p-4">
      {/* Decoration only: a soft orange glow behind the icon that brightens on hover */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-8 -top-8 size-24 rounded-full bg-accent/15 opacity-50 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
      />

      {/* Top part: label and value on the left, icon on the right.
          `relative` keeps it above the glow. */}
      <div className="relative flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-muted sm:text-[13px]">{label}</p>
          <p className="mt-1 truncate text-xl font-semibold leading-tight tracking-tight text-ink tabular-nums sm:text-2xl">
            {value}
            {unit && <span className="ml-1 text-xs font-medium tracking-normal text-muted sm:text-sm">{unit}</span>}
          </p>
        </div>

        <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent ring-1 ring-inset ring-accent/15 sm:size-9">
          <Icon className="size-4" strokeWidth={2} />
        </span>
      </div>

      {/* Bottom line: the trend badge and/or the caption */}
      {(change !== undefined || caption) && (
        <div className="relative mt-2 flex items-center gap-1.5 text-[11px] text-muted sm:text-xs">
          {change !== undefined && <TrendBadge change={change} isUpGood={isUpGood} className="shrink-0" />}
          {caption && (
            <p className={captionClassName} title={caption}>
              {caption}
            </p>
          )}
        </div>
      )}

      {trend && (
        // The negative margins (same size as the card's padding) stretch the
        // trend line right to the card's edges
        <div className="relative -mx-3.5 -mb-3.5 mt-2 sm:-mx-4 sm:-mb-4">
          <Sparkline values={trend} heightClass="h-8" />
        </div>
      )}
    </div>
  )
}
