import { Bell, ChevronRight, Moon, Sun } from 'lucide-react'
import type { Theme } from '../../hooks/useTheme'
import { IconButton } from '../buttons/IconButton'
import { SearchInput } from '../inputs/SearchInput'
import { UserBadge } from './UserBadge'

type TopbarProps = {
  breadcrumbs: string[]
  theme: Theme
  onThemeToggle: () => void
  hasUnreadNotifications: boolean
  userName: string
  userRole: string
  onSignOut: () => void
}

// Desktop-only top bar (lg and up). Phones and tablets use MobileTopbar instead.
export function Topbar({
  breadcrumbs,
  theme,
  onThemeToggle,
  hasUnreadNotifications,
  userName,
  userRole,
  onSignOut,
}: TopbarProps) {
  const lastIndex = breadcrumbs.length - 1

  return (
    <header className="sticky top-0 z-30 hidden h-[72px] items-center gap-3 border-b border-line bg-canvas/80 px-8 backdrop-blur-xl lg:flex">
      <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 text-sm">
        {breadcrumbs.map((crumb, index) => (
          <span key={crumb} className="flex items-center gap-1.5">
            {index > 0 && <ChevronRight className="size-3.5 text-muted/60" />}
            <span className={index === lastIndex ? 'font-semibold text-ink' : 'text-muted'}>{crumb}</span>
          </span>
        ))}
      </nav>

      <div className="ml-auto flex items-center gap-2">
        <SearchInput placeholder="Search rides, drivers, customers…" enableShortcut className="w-72 xl:w-80" />

        <IconButton
          icon={theme === 'dark' ? Sun : Moon}
          label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          onClick={onThemeToggle}
        />
        <IconButton icon={Bell} label="Notifications" showDot={hasUnreadNotifications} />

        <div className="mx-1 h-6 w-px bg-line" />

        <UserBadge name={userName} role={userRole} onSignOut={onSignOut} />
      </div>
    </header>
  )
}
