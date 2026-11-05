import type { LucideIcon } from 'lucide-react'
import { Link } from 'react-router'

type BottomNavItemProps = {
  icon: LucideIcon
  label: string
  isActive: boolean
  // Give `path` to link to a page, or `onClick` to run an action (e.g. open a sheet)
  path?: string
  onClick?: () => void
}

export function BottomNavItem({ icon: Icon, label, isActive, path, onClick }: BottomNavItemProps) {
  const itemClasses = 'flex flex-1 flex-col items-center gap-1 pt-2 outline-none'

  // Material-style pill behind the icon marks the active tab
  const content = (
    <>
      <span
        className={`grid h-8 w-14 place-items-center rounded-full transition-all duration-200 ${isActive ? 'bg-accent-soft text-accent' : 'text-muted'}`}
      >
        <Icon className="size-[22px]" strokeWidth={isActive ? 2.25 : 1.75} />
      </span>
      <span
        className={`text-[11px] leading-none transition-colors ${isActive ? 'font-semibold text-ink' : 'font-medium text-muted'}`}
      >
        {label}
      </span>
    </>
  )

  if (path) {
    return (
      <Link to={path} aria-current={isActive ? 'page' : undefined} className={itemClasses}>
        {content}
      </Link>
    )
  }

  return (
    <button type="button" onClick={onClick} aria-expanded={isActive} className={itemClasses}>
      {content}
    </button>
  )
}
