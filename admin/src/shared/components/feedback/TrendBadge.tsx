import { TrendingDown, TrendingUp } from 'lucide-react'

type TrendBadgeProps = {
  // Change against the previous period as a fraction, e.g. 0.124 means +12.4%
  change: number
  // Set to false for numbers where going down is good, e.g. cancellations
  isUpGood?: boolean
  className?: string
}

// Small green/red pill with an arrow, e.g. "↗ 12.4%"
export function TrendBadge({ change, isUpGood = true, className = '' }: TrendBadgeProps) {
  const isUp = change >= 0
  // Green when the number moved the good way, red when it moved the bad way
  const isGood = isUp === isUpGood
  const colorClasses = isGood ? 'bg-success-soft text-success' : 'bg-danger-soft text-danger'
  const Icon = isUp ? TrendingUp : TrendingDown
  const sign = isUp ? '+' : '−'

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums ${colorClasses} ${className}`}
    >
      <Icon className="size-3" strokeWidth={2.5} />
      {sign}
      {Math.abs(change * 100).toFixed(1)}%
    </span>
  )
}
