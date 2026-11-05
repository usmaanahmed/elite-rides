import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Card } from './Card'

type EmptyStateCardProps = {
  icon: LucideIcon
  title: string
  description: string
  // Optional button shown under the text, e.g. "Add vehicle"
  action?: ReactNode
  className?: string
}

export function EmptyStateCard({ icon: Icon, title, description, action, className = '' }: EmptyStateCardProps) {
  return (
    <Card className={`flex flex-col items-center py-16 text-center ${className}`}>
      <div className="grid size-12 place-items-center rounded-xl bg-accent-soft text-accent">
        <Icon className="size-6" strokeWidth={1.75} />
      </div>
      <p className="mt-4 text-sm font-semibold text-ink">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-muted">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </Card>
  )
}
