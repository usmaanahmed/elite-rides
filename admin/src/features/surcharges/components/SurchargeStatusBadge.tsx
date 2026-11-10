import type { SurchargeStatus } from '../types/surcharge'

type SurchargeStatusBadgeProps = {
  status: SurchargeStatus
}

// A small pill showing whether a surcharge is Active or Inactive
export function SurchargeStatusBadge({ status }: SurchargeStatusBadgeProps) {
  if (status === 'active') {
    return (
      <span className="rounded-full bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent">Active</span>
    )
  }
  return <span className="rounded-full bg-surface-muted px-2.5 py-1 text-xs font-semibold text-muted">Inactive</span>
}
