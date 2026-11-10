import { LogOut, Moon } from 'lucide-react'
import type { ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router'
import type { Theme } from '../../hooks/useTheme'
import type { NavItem, NavSection } from '../../types/navigation'
import { getInitials } from '../../utils/getInitials'
import { Switch } from '../inputs/Switch'
import { BottomSheet } from '../sheets/BottomSheet'
import { SystemStatusCard } from '../sidebar/SystemStatusCard'
import { MobileMenuRow } from './MobileMenuRow'

type MobileMenuSheetProps = {
  isOpen: boolean
  onClose: () => void
  sections: NavSection[]
  footerItems: NavItem[]
  theme: Theme
  onThemeToggle: () => void
  userName: string
  userRole: string
  onSignOut: () => void
}

// Rounded white card that groups menu rows, with thin lines between them
function MenuGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-6 first:mt-0">
      <h3 className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">{title}</h3>
      <div className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
        {children}
      </div>
    </section>
  )
}

// Full app menu for phones: profile, every page, and preferences such as dark mode
export function MobileMenuSheet({
  isOpen,
  onClose,
  sections,
  footerItems,
  theme,
  onThemeToggle,
  userName,
  userRole,
  onSignOut,
}: MobileMenuSheetProps) {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  function goTo(path: string) {
    navigate(path)
    onClose()
  }

  function renderRow(item: NavItem) {
    return (
      <MobileMenuRow
        key={item.path}
        icon={item.icon}
        label={item.label}
        badge={item.badge}
        isActive={pathname === item.path}
        onClick={() => goTo(item.path)}
      />
    )
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Menu">
      {/* Profile card */}
      <div className="mb-6 flex items-center gap-3 rounded-2xl border border-line bg-surface p-4">
        <span className="rounded-full bg-linear-to-br from-[#ff8a3d] to-[#e04f00] p-[2px]">
          <span className="grid size-11 place-items-center rounded-full bg-surface text-sm font-semibold text-ink">
            {getInitials(userName)}
          </span>
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-semibold text-ink">{userName}</p>
          <p className="truncate text-sm text-muted">{userRole}</p>
        </div>
      </div>

      {sections.map((section) => (
        <MenuGroup key={section.title} title={section.title}>
          {section.items.map(renderRow)}
        </MenuGroup>
      ))}

      <MenuGroup title="Preferences">
        <MobileMenuRow
          icon={Moon}
          label="Dark mode"
          onClick={onThemeToggle}
          isPressed={theme === 'dark'}
          trailing={<Switch isOn={theme === 'dark'} />}
        />
        {footerItems.map(renderRow)}
      </MenuGroup>

      <div className="mt-6">
        <SystemStatusCard title="All systems operational" subtitle="Last checked 2 min ago" />
      </div>

      <button
        type="button"
        onClick={() => {
          onSignOut()
          onClose()
        }}
        className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-line bg-surface text-[15px] font-semibold text-red-600 transition-colors active:bg-nav-hover dark:text-red-400"
      >
        <LogOut className="size-[18px]" strokeWidth={2} />
        Sign out
      </button>

      <p className="mt-4 text-center text-xs text-muted">Elite Rides Admin · v1.0.0</p>
    </BottomSheet>
  )
}
