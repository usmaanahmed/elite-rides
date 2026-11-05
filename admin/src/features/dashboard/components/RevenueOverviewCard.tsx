import { useId } from 'react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card } from '../../../shared/components/cards/Card'
import { ChartLegend } from '../../../shared/components/charts/ChartLegend'
import {
  ACTIVE_DOT,
  AXIS_TICK_STYLE,
  CHART_COLORS,
  CROSSHAIR_CURSOR,
} from '../../../shared/components/charts/chartStyles'
import { ChartTooltip } from '../../../shared/components/charts/ChartTooltip'
import { TrendBadge } from '../../../shared/components/feedback/TrendBadge'
import { formatCompactPounds, formatPounds } from '../../../shared/utils/formatNumbers'
import type { TrendPoint } from '../types/dashboard'
import { getChange, getTrendTotals } from '../utils/dashboardMath'

type RevenueOverviewCardProps = {
  trend: TrendPoint[]
  // e.g. "vs previous 30 days"
  comparisonLabel: string
  className?: string
}

// The dashboard's headline: total revenue, plus a chart comparing it with the previous period
export function RevenueOverviewCard({ trend, comparisonLabel, className = '' }: RevenueOverviewCardProps) {
  // SVG gradient ids must be unique on the page and contain only letters and numbers
  const gradientId = `revenue-${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const totals = getTrendTotals(trend)

  return (
    <Card className={`relative overflow-hidden ${className}`}>
      {/* Soft brand-colour glow in the corner, purely decorative */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-32 size-80 rounded-full bg-accent/10 blur-3xl"
      />

      <div className="relative flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[13px] font-medium text-muted">Total revenue</p>
          <div className="mt-1.5 flex flex-wrap items-center gap-3">
            <p className="text-4xl font-semibold tracking-tight text-ink sm:text-5xl">{formatPounds(totals.revenue)}</p>
            <TrendBadge change={getChange(totals.revenue, totals.previousRevenue)} />
          </div>
          <p className="mt-2 text-xs text-muted">
            <span className="font-medium text-ink/80">{formatPounds(totals.previousRevenue)}</span> {comparisonLabel}
          </p>
        </div>

        <ChartLegend
          items={[
            { label: 'This period', color: CHART_COLORS.primary, shape: 'line' },
            { label: 'Previous period', color: CHART_COLORS.muted, shape: 'line', isFaded: true },
          ]}
        />
      </div>

      <div className="relative -mx-1 mt-6 h-64 sm:h-75">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trend} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={CHART_COLORS.primary} stopOpacity={0.2} />
                <stop offset="100%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} stroke={CHART_COLORS.grid} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={AXIS_TICK_STYLE}
              tickMargin={12}
              minTickGap={28}
            />
            <YAxis
              tickFormatter={formatCompactPounds}
              tickLine={false}
              axisLine={false}
              tick={AXIS_TICK_STYLE}
              width={52}
            />
            <Tooltip
              cursor={CROSSHAIR_CURSOR}
              content={<ChartTooltip formatValue={formatPounds} />}
              // List "This period" above "Previous period" in the tooltip
              itemSorter={(item) => (item.dataKey === 'revenue' ? 0 : 1)}
              animationDuration={150}
            />

            {/* Drawn first so it sits underneath this period's line */}
            <Area
              type="monotone"
              dataKey="previousRevenue"
              name="Previous period"
              stroke={CHART_COLORS.muted}
              strokeOpacity={0.45}
              strokeWidth={2}
              fill="none"
              dot={false}
              activeDot={{ ...ACTIVE_DOT, fill: CHART_COLORS.muted }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              name="This period"
              stroke={CHART_COLORS.primary}
              strokeWidth={2.25}
              fill={`url(#${gradientId})`}
              dot={false}
              activeDot={{ ...ACTIVE_DOT, fill: CHART_COLORS.primary }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
