import type { BlogStatus } from '../types/blog'

type BlogStatusBadgeProps = {
  status: BlogStatus
}

// A small coloured pill: green "Published" or grey "Draft"
export function BlogStatusBadge({ status }: BlogStatusBadgeProps) {
  if (status === 'published') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-success-soft px-2.5 py-1 text-xs font-semibold text-success">
        <span className="size-1.5 rounded-full bg-success" />
        Published
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-muted px-2.5 py-1 text-xs font-semibold text-muted ring-1 ring-line">
      <span className="size-1.5 rounded-full bg-muted" />
      Draft
    </span>
  )
}
