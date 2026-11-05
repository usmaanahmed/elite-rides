import { CornerDownRight } from 'lucide-react'
import { ChartCard } from '../../../shared/components/charts/ChartCard'
import { formatCompactPounds, formatCount, formatPercent } from '../../../shared/utils/formatNumbers'
import type { TopRoute } from '../types/dashboard'

type TopRoutesCardProps = {
  routes: TopRoute[]
  // All bookings in the period, used to show what share the top routes make up
  totalBookings: number
  className?: string
}

// Ranked list of the most booked journeys, each with a bar showing its size
export function TopRoutesCard({ routes, totalBookings, className = '' }: TopRoutesCardProps) {
  // Bars are sized against the busiest route, so the top route fills the whole width
  const mostBookings = Math.max(...routes.map((route) => route.bookings), 1)
  const topRouteBookings = routes.reduce((sum, route) => sum + route.bookings, 0)

  return (
    <ChartCard title="Top routes" description="Most booked journeys" className={className}>
      <ol className="space-y-5">
        {routes.map((route, index) => (
          <li key={route.id} className="flex gap-3">
            <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-surface-muted text-xs font-semibold tabular-nums text-muted ring-1 ring-line">
              {index + 1}
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink">{route.from}</p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-muted">
                    <CornerDownRight className="size-3 shrink-0" strokeWidth={2} />
                    <span className="truncate">{route.to}</span>
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-semibold tabular-nums text-ink">{formatCount(route.bookings)}</p>
                  <p className="mt-0.5 text-[11px] tabular-nums text-muted">{formatCompactPounds(route.revenue)}</p>
                </div>
              </div>

              <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-chart-1/12">
                <div
                  className="h-full rounded-full bg-chart-1 transition-[width] duration-500 ease-out"
                  style={{ width: `${(route.bookings / mostBookings) * 100}%` }}
                />
              </div>
            </div>
          </li>
        ))}
      </ol>

      {totalBookings > 0 && (
        // mt-auto pushes the summary to the bottom of the card; pt-5 keeps a gap above it
        <div className="mt-auto pt-5">
          <p className="border-t border-line pt-4 text-xs text-muted">
            These {routes.length} routes make up{' '}
            <span className="font-semibold text-ink">{formatPercent(topRouteBookings / totalBookings)}</span> of all
            bookings.
          </p>
        </div>
      )}
    </ChartCard>
  )
}
