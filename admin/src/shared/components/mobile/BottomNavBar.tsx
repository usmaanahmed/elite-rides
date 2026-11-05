import { LayoutGrid, Plus } from 'lucide-react'
import { useLocation } from 'react-router'
import type { MobileTab } from '../../types/navigation'
import { BottomNavItem } from './BottomNavItem'

type BottomNavBarProps = {
  tabs: MobileTab[]
  onCreateClick: () => void
  onMenuClick: () => void
  isCreateOpen: boolean
  isMenuOpen: boolean
}

// Bottom tab bar for phones and tablets: two tabs, a raised "+" button, the remaining tabs and "Menu"
export function BottomNavBar({ tabs, onCreateClick, onMenuClick, isCreateOpen, isMenuOpen }: BottomNavBarProps) {
  const { pathname } = useLocation()

  function isTabActive(tab: MobileTab) {
    return pathname === tab.path || tab.relatedPaths.includes(pathname)
  }

  const leftTabs = tabs.slice(0, 2)
  const rightTabs = tabs.slice(2)

  // Pages without their own tab (e.g. Surcharges) are reached through the menu,
  // so the Menu tab lights up on those pages.
  const isOnTabPage = tabs.some((tab) => isTabActive(tab))
  const isMenuActive = isMenuOpen || !isOnTabPage

  function renderTab(tab: MobileTab) {
    return (
      <BottomNavItem
        key={tab.path}
        path={tab.path}
        icon={tab.icon}
        label={tab.label}
        isActive={isTabActive(tab)}
      />
    )
  }

  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/85 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden"
    >
      <div className="mx-auto flex h-16 max-w-lg items-start px-2">
        {leftTabs.map(renderTab)}

        {/* Raised centre button. Its canvas-coloured ring makes it look cut out of the bar. */}
        <div className="flex flex-1 justify-center">
          <button
            type="button"
            onClick={onCreateClick}
            aria-label="Create new"
            aria-expanded={isCreateOpen}
            className="-mt-6 grid size-[58px] place-items-center rounded-full bg-linear-to-br from-[#ff8a3d] to-[#e04f00] text-white shadow-[0_12px_24px_-8px_rgba(252,98,3,0.75)] ring-[6px] ring-canvas transition-transform duration-150 active:scale-90"
          >
            <Plus
              className={`size-7 transition-transform duration-300 ${isCreateOpen ? 'rotate-45' : ''}`}
              strokeWidth={2.5}
            />
          </button>
        </div>

        {rightTabs.map(renderTab)}

        <BottomNavItem icon={LayoutGrid} label="Menu" isActive={isMenuActive} onClick={onMenuClick} />
      </div>
    </nav>
  )
}
