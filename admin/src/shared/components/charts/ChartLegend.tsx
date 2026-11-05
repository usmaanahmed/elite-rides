export type ChartLegendItem = {
  label: string
  // Any CSS colour, usually a chart variable such as 'var(--chart-1)'
  color: string
  // 'line' for line/area charts, 'square' for bars and segments
  shape: 'line' | 'square'
  // Draws the key faded, to match a series drawn faded on the chart
  isFaded?: boolean
}

type ChartLegendProps = {
  items: ChartLegendItem[]
  className?: string
}

export function ChartLegend({ items, className = '' }: ChartLegendProps) {
  return (
    <ul className={`flex flex-wrap items-center gap-x-4 gap-y-1.5 ${className}`}>
      {items.map((item) => (
        <li key={item.label} className="flex items-center gap-2 text-xs font-medium text-muted">
          <span
            className={item.shape === 'line' ? 'h-[3px] w-3.5 rounded-full' : 'size-2.5 rounded-[3px]'}
            style={{ backgroundColor: item.color, opacity: item.isFaded ? 0.45 : 1 }}
          />
          {item.label}
        </li>
      ))}
    </ul>
  )
}
