// One row of the tooltip, as Recharts passes it in
type TooltipEntry = {
  name?: string | number
  value?: string | number
  color?: string
  dataKey?: string | number
}

type ChartTooltipProps = {
  // `active`, `payload` and `label` are filled in by Recharts automatically
  active?: boolean
  payload?: TooltipEntry[]
  label?: string | number
  // How each value is shown, e.g. formatPounds turns 1200 into "£1,200"
  formatValue?: (value: number) => string
  // Shown under the heading, e.g. "06:00 – 07:00"
  formatLabel?: (label: string) => string
}

// Custom tooltip for Recharts charts. Usage:
// <Tooltip content={<ChartTooltip formatValue={formatPounds} />} />
export function ChartTooltip({ active, payload, label, formatValue, formatLabel }: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null

  const heading = formatLabel ? formatLabel(String(label)) : label

  return (
    <div className="min-w-40 rounded-xl border border-line bg-surface/95 px-3.5 py-3 shadow-[0_12px_32px_-12px_rgba(16,24,40,0.28)] backdrop-blur-md">
      <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-muted">{heading}</p>

      <div className="mt-2 space-y-1.5">
        {payload.map((entry) => {
          const value = Number(entry.value ?? 0)
          return (
            <div key={String(entry.dataKey)} className="flex items-center gap-2.5">
              {/* A short stroke in the series colour tells the rows apart */}
              <span className="h-[3px] w-3 shrink-0 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-sm font-semibold tabular-nums text-ink">
                {formatValue ? formatValue(value) : value}
              </span>
              <span className="ml-auto pl-3 text-xs text-muted">{entry.name}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
