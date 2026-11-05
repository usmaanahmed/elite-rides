import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ChartCard } from '../../../shared/components/charts/ChartCard'
import { ChartLegend } from '../../../shared/components/charts/ChartLegend'
import { AXIS_TICK_STYLE, CHART_COLORS } from '../../../shared/components/charts/chartStyles'
import { ChartTooltip } from '../../../shared/components/charts/ChartTooltip'
import { formatCompactCount, formatCount } from '../../../shared/utils/formatNumbers'
import type { HourlyBookings } from '../types/dashboard'

type PeakHoursCardProps = {
  hourlyBookings: HourlyBookings[]
  className?: string
}

// How many of the busiest hours are drawn in full colour
const HIGHLIGHTED_HOUR_COUNT = 3

// Only a few hours are labelled on the x-axis so the labels never overlap
const X_AXIS_TICKS = ['00:00', '06:00', '12:00', '18:00', '23:00']

// "06:00" → "06:00 – 07:00"
function formatHourRange(hour: string): string {
  const nextHour = (Number(hour.slice(0, 2)) + 1) % 24
  return `${hour} – ${String(nextHour).padStart(2, '0')}:00`
}

// Column chart of pickups per hour of the day, with the busiest hours highlighted
export function PeakHoursCard({ hourlyBookings, className = '' }: PeakHoursCardProps) {
  // Copy before sorting so the chart's original hour order isn't changed
  const busiestFirst = [...hourlyBookings].sort((a, b) => b.bookings - a.bookings)
  const busiestHours = busiestFirst.slice(0, HIGHLIGHTED_HOUR_COUNT).map((item) => item.hour)
  const busiestHour = busiestFirst[0]

  return (
    <ChartCard
      title="Peak booking hours"
      description="Pickups by hour of the day"
      className={className}
      action={
        busiestHour && (
          <div className="rounded-xl border border-line bg-surface-muted px-3 py-2 text-right">
            <p className="text-[11px] font-medium text-muted">Busiest hour</p>
            <p className="text-sm font-semibold tabular-nums text-ink">{formatHourRange(busiestHour.hour)}</p>
          </div>
        )
      }
    >
      <div className="-mx-1 h-60">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={hourlyBookings} margin={{ top: 8, right: 4, bottom: 0, left: 0 }} barCategoryGap="22%">
            <CartesianGrid vertical={false} stroke={CHART_COLORS.grid} />
            <XAxis
              dataKey="hour"
              ticks={X_AXIS_TICKS}
              tickLine={false}
              axisLine={false}
              tick={AXIS_TICK_STYLE}
              tickMargin={12}
            />
            <YAxis
              tickFormatter={formatCompactCount}
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
              tick={AXIS_TICK_STYLE}
              width={40}
            />
            <Tooltip
              cursor={{ fill: CHART_COLORS.hoverBand }}
              content={<ChartTooltip formatValue={formatCount} formatLabel={formatHourRange} />}
              animationDuration={150}
            />
            <Bar dataKey="bookings" name="Pickups" fill={CHART_COLORS.primary} radius={[4, 4, 0, 0]} maxBarSize={22}>
              {/* A <Cell> per bar lets each bar have its own opacity */}
              {hourlyBookings.map((item) => (
                <Cell key={item.hour} fillOpacity={busiestHours.includes(item.hour) ? 1 : 0.3} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <ChartLegend
        className="mt-4"
        items={[
          { label: `Top ${HIGHLIGHTED_HOUR_COUNT} hours`, color: CHART_COLORS.primary, shape: 'square' },
          { label: 'Other hours', color: CHART_COLORS.primary, shape: 'square', isFaded: true },
        ]}
      />
    </ChartCard>
  )
}
