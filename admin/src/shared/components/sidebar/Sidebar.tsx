import { ChevronsLeft } from 'lucide-react'
import type { NavItem, NavSection } from '../../types/navigation'
import { SidebarBrand } from './SidebarBrand'
import { SidebarNavItem } from './SidebarNavItem'
import { SystemStatusCard } from './SystemStatusCard'

type SidebarProps = {
  sections: NavSection[]
  footerItems: NavItem[]
  isCollapsed: boolean
  onToggleCollapse: () => void
}

// Desktop-only sidebar (lg and up). Phones and tablets use the bottom nav bar instead.
export function Sidebar({ sections, footerItems, isCollapsed, onToggleCollapse }: SidebarProps) {
  // The sidebar can be narrow (icons only) or wide
  const widthClasses = isCollapsed ? 'w-[84px]' : 'w-[272px]'

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 hidden flex-col border-r border-line bg-sidebar transition-[width] duration-300 ease-out lg:flex ${widthClasses}`}
    >
      <SidebarBrand name="Elite Rides" tagline="Admin Console" isCollapsed={isCollapsed} />

      {/* Collapse / expand toggle sitting on the sidebar's right edge */}
      <button
        type="button"
        onClick={onToggleCollapse}
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className="absolute -right-3 top-[24px] grid size-6 place-items-center rounded-full border border-line bg-surface text-muted shadow-sm transition-colors hover:text-ink"
      >
        <ChevronsLeft className={`size-3.5 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
      </button>

      <nav className="scrollbar-thin flex-1 overflow-y-auto px-4 pb-4 pt-2">
        {sections.map((section) => (
          <div key={section.title} className="mt-5 first:mt-2">
            <p
              className={`mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted/70 ${isCollapsed ? 'hidden' : ''}`}
            >
              {section.title}
            </p>
            {/* Collapsed mode replaces section titles with a thin divider */}
            {isCollapsed && <div className="mx-auto mb-3 h-px w-8 bg-line" />}

            <div className="space-y-1">
              {section.items.map((item) => (
                <SidebarNavItem key={item.path} item={item} isCollapsed={isCollapsed} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="shrink-0 space-y-3 border-t border-line p-4">
        <div className={isCollapsed ? 'hidden' : ''}>
          <SystemStatusCard title="All systems operational" subtitle="Last checked 2 min ago" />
        </div>

        <div className="space-y-1">
          {footerItems.map((item) => (
            <SidebarNavItem key={item.path} item={item} isCollapsed={isCollapsed} />
          ))}
        </div>
      </div>
    </aside>
  )
}
