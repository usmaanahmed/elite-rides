import { ChevronRight, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

type MobileMenuRowProps = {
  icon: LucideIcon
  label: string
  onClick: () => void
  isActive?: boolean
  badge?: string | number
  // Shown on the right instead of the arrow, e.g. a <Switch />
  trailing?: ReactNode
  // Set for on/off rows, so screen readers announce the current state
  isPressed?: boolean
}

// One tappable row in a grouped, iOS-settings-style list
export function MobileMenuRow({
  icon: Icon,
  label,
  onClick,
  isActive = false,
  badge,
  trailing,
  isPressed,
}: MobileMenuRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={isActive ? 'page' : undefined}
      aria-pressed={isPressed}
      className={`flex min-h-[52px] w-full items-center gap-3 px-4 py-2 text-left transition-colors active:bg-nav-hover ${isActive ? 'bg-nav-active' : ''}`}
    >
      <span
        className={`grid size-8 shrink-0 place-items-center rounded-[10px] ${isActive ? 'bg-accent text-white' : 'bg-accent-soft text-accent'}`}
      >
        <Icon className="size-[17px]" strokeWidth={2} />
      </span>

      <span className="min-w-0 flex-1 truncate text-[15px] font-medium text-ink">{label}</span>

      {badge !== undefined && (
        <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-semibold text-accent-ink">
          {badge}
        </span>
      )}

      {trailing ?? <ChevronRight className="size-4 shrink-0 text-muted/60" strokeWidth={2} />}
    </button>
  )
}
