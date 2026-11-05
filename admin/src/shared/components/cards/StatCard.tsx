import type { LucideIcon } from 'lucide-react'
import { Sparkline } from '../charts/Sparkline'
import { TrendBadge } from '../feedback/TrendBadge'
import { Card } from './Card'

type StatCardProps = {
  label: string
  // Already formatted, e.g. "£48,210" or "1,284"
  value: string
  icon: LucideIcon
  // Change against the previous period as a fraction, e.g. 0.124 means +12.4%
  change?: number
  // Set to false for numbers where going down is good, e.g. cancellations
  isUpGood?: boolean
  // e.g. "vs previous 30 days"
  comparisonLabel?: string
  // Values for the small trend line at the bottom, oldest first
  trend?: number[]
}

export function StatCard({ label, value, icon: Icon, change, isUpGood = true, comparisonLabel, trend }: StatCardProps) {
  return (
    <Card className="group flex flex-col transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_32px_-20px_rgba(16,24,40,0.25)]">
      <div className="flex items-start justify-between gap-2">
        <div className="grid size-9 place-items-center rounded-xl bg-accent-soft text-accent ring-1 ring-accent/10 sm:size-10">
          <Icon className="size-[18px]" strokeWidth={1.75} />
        </div>
        {change !== undefined && <TrendBadge change={change} isUpGood={isUpGood} />}
      </div>

      <p className="mt-4 truncate text-xs font-medium text-muted sm:text-[13px]">{label}</p>
      <p className="mt-1 truncate text-xl font-semibold tracking-tight text-ink sm:text-[26px]">{value}</p>

      {trend && <Sparkline values={trend} heightClass="mt-3 h-9 sm:h-10" />}

      {comparisonLabel && <p className="mt-2 hidden text-[11px] text-muted sm:block">{comparisonLabel}</p>}
    </Card>
  )
}
