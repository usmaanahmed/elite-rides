import { Bar, BarChart, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ChartCard } from '../../../shared/components/charts/ChartCard'
import { CHART_COLORS } from '../../../shared/components/charts/chartStyles'
import { ChartTooltip } from '../../../shared/components/charts/ChartTooltip'
import { formatCount, formatPercent } from '../../../shared/utils/formatNumbers'
import type { VehicleBookings } from '../types/dashboard'

type VehicleMixCardProps = {
  vehicleBookings: VehicleBookings[]
  className?: string
}

type VehicleNameTickProps = {
  // Filled in by Recharts: the label's vertical position and its text
  y?: number
  payload?: { value: string }
}

// Draws each vehicle name left-aligned on one line. Recharts' default tick is
// right-aligned and wraps long names like "Executive Saloon" onto two lines.
function VehicleNameTick({ y, payload }: VehicleNameTickProps) {
  return (
    <text x={0} y={y} dy={4} fill="var(--ink)" fontSize={12} fontWeight={500}>
      {payload?.value}
    </text>
  )
}

// Horizontal bars showing which vehicles customers book most
export function VehicleMixCard({ vehicleBookings, className = '' }: VehicleMixCardProps) {
  const totalBookings = vehicleBookings.reduce((sum, vehicle) => sum + vehicle.bookings, 0)
  // The list is already sorted biggest first
  const mostPopular = vehicleBookings[0]

  return (
    <ChartCard title="Bookings by vehicle" description="Which vehicles customers choose" className={className}>
      {/* Grows to fill the card when the revenue card beside it is taller */}
      <div className="min-h-70 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={vehicleBookings}
            layout="vertical"
            margin={{ top: 0, right: 48, bottom: 0, left: 0 }}
            barCategoryGap={10}
          >
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="vehicleName"
              width={124}
              tickLine={false}
              axisLine={false}
              tick={<VehicleNameTick />}
            />
            <Tooltip
              cursor={{ fill: CHART_COLORS.hoverBand }}
              content={<ChartTooltip formatValue={formatCount} />}
              animationDuration={150}
            />
            <Bar dataKey="bookings" name="Bookings" fill={CHART_COLORS.primary} radius={[0, 4, 4, 0]} maxBarSize={14}>
              {/* The count at the end of each bar */}
              <LabelList
                dataKey="bookings"
                position="right"
                offset={10}
                formatter={(value) => formatCount(Number(value))}
                style={{ fill: 'var(--muted)', fontSize: 11, fontWeight: 600 }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {mostPopular && totalBookings > 0 && (
        <p className="mt-auto border-t border-line pt-4 text-xs text-muted">
          <span className="font-semibold text-ink">{mostPopular.vehicleName}</span> makes up{' '}
          <span className="font-semibold text-ink">{formatPercent(mostPopular.bookings / totalBookings)}</span> of all
          bookings.
        </p>
      )}
    </ChartCard>
  )
}
