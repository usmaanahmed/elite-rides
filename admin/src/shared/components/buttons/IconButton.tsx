import type { LucideIcon } from 'lucide-react'

type IconButtonProps = {
  icon: LucideIcon
  label: string
  onClick?: () => void
  showDot?: boolean
  className?: string
}

export function IconButton({ icon: Icon, label, onClick, showDot = false, className = '' }: IconButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`relative grid size-10 place-items-center rounded-xl text-muted transition-colors hover:bg-nav-hover hover:text-ink ${className}`}
    >
      <Icon className="size-[18px]" strokeWidth={1.75} />
      {showDot && (
        <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-accent ring-2 ring-canvas" />
      )}
    </button>
  )
}
