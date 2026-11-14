import type { LucideIcon } from 'lucide-react'

type ToolbarButtonProps = {
  icon: LucideIcon
  // Shown as a tooltip and read by screen readers, e.g. "Bold (Ctrl+B)"
  label: string
  onClick: () => void
  // True while the feature is on at the cursor, e.g. the text is bold
  isActive?: boolean
  disabled?: boolean
}

// One square icon button in the editor toolbar
export function ToolbarButton({ icon: Icon, label, onClick, isActive = false, disabled = false }: ToolbarButtonProps) {
  const stateClasses = isActive ? 'bg-accent-soft text-accent-ink' : 'text-muted hover:bg-nav-hover hover:text-ink'

  return (
    <button
      type="button"
      onClick={onClick}
      // Stop the button from taking focus away from the text, so the selection stays
      onMouseDown={(event) => event.preventDefault()}
      disabled={disabled}
      aria-label={label}
      aria-pressed={isActive}
      title={label}
      className={`grid size-8 shrink-0 place-items-center rounded-lg transition-colors disabled:pointer-events-none disabled:opacity-35 ${stateClasses}`}
    >
      <Icon className="size-4" strokeWidth={2} />
    </button>
  )
}
