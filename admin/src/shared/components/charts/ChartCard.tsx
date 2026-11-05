import type { ReactNode } from 'react'
import { Card } from '../cards/Card'

type ChartCardProps = {
  title: string
  description?: string
  // Shown on the right of the title, e.g. a legend or a "View all" link
  action?: ReactNode
  children: ReactNode
  className?: string
}

// A card with a title row, used to frame every chart and list on the dashboard
export function ChartCard({ title, description, action, children, className = '' }: ChartCardProps) {
  return (
    <Card className={`flex flex-col ${className}`}>
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
        <div className="min-w-0">
          <h2 className="text-[15px] font-semibold tracking-tight text-ink">{title}</h2>
          {description && <p className="mt-0.5 text-xs text-muted">{description}</p>}
        </div>
        {action}
      </div>
      <div className="mt-5 flex grow flex-col">{children}</div>
    </Card>
  )
}
