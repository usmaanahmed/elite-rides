import { NavLink } from 'react-router'
import type { NavItem } from '../../types/navigation'
import { ROUTES } from '../../constants/routes'

type SidebarNavItemProps = {
  item: NavItem
  isCollapsed: boolean
}

export function SidebarNavItem({ item, isCollapsed }: SidebarNavItemProps) {
  const Icon = item.icon

  // When collapsed, centre the icon and drop the side padding
  const collapsedClasses = isCollapsed ? 'justify-center px-0' : 'px-3'

  function getLinkClasses(isActive: boolean) {
    const stateClasses = isActive ? 'bg-nav-active text-ink' : 'text-muted hover:bg-nav-hover hover:text-ink'
    return `group relative flex h-10 w-full items-center gap-3 rounded-xl text-sm font-medium transition-colors ${stateClasses} ${collapsedClasses}`
  }

  // NavLink works out whether its path matches the current URL and passes that in as `isActive`.
  // `end` stops the dashboard link ('/') from being active on every other page.
  return (
    <NavLink
      to={item.path}
      end={item.path === ROUTES.dashboard}
      title={isCollapsed ? item.label : undefined}
      className={({ isActive }) => getLinkClasses(isActive)}
    >
      {({ isActive }) => (
        <>
          {/* Brand-colour bar on the left edge of the sidebar marks the active page */}
          {isActive && (
            <span className="absolute -left-4 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-accent" />
          )}

          <Icon
            className={`size-[18px] shrink-0 transition-colors ${isActive ? 'text-accent' : 'text-muted group-hover:text-ink'}`}
            strokeWidth={1.75}
          />

          <span className={`truncate ${isCollapsed ? 'hidden' : ''}`}>{item.label}</span>

          {item.badge !== undefined &&
            (isCollapsed ? (
              // In collapsed mode there is no room for the badge, so show a small dot instead
              <span className="absolute right-3 top-2 size-1.5 rounded-full bg-accent" />
            ) : (
              <span className="ml-auto rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-semibold text-accent-ink">
                {item.badge}
              </span>
            ))}
        </>
      )}
    </NavLink>
  )
}
