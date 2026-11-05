import { useId } from 'react'
import { Area, AreaChart, ResponsiveContainer, YAxis } from 'recharts'
import { CHART_COLORS } from './chartStyles'

type SparklineProps = {
  // The values to draw, oldest first
  values: number[]
  color?: string
  heightClass?: string
}

// A tiny trend line with no axes, used inside stat cards
export function Sparkline({ values, color = CHART_COLORS.primary, heightClass = 'h-10' }: SparklineProps) {
  // Each sparkline needs its own gradient id. React's ids contain symbols that
  // break SVG's url(#id) references, so keep only letters and numbers.
  const gradientId = `sparkline-${useId().replace(/[^a-zA-Z0-9]/g, '')}`

  // Recharts reads data as a list of objects
  const data = values.map((value, index) => ({ index, value }))

  return (
    <div className={`w-full ${heightClass}`} aria-hidden="true">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 4, right: 2, bottom: 2, left: 2 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.22} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          {/* Start the scale at the smallest value, not 0, so small changes are visible */}
          <YAxis hide domain={['dataMin', 'dataMax']} />
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={1.75}
            fill={`url(#${gradientId})`}
            dot={false}
            activeDot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
