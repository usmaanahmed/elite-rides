import { useState } from 'react'
import { Outlet, ScrollRestoration, useLocation, useNavigate } from 'react-router'
import { useAuth } from '../../auth/AuthContext'
import {
  footerNavigation,
  getNavItemLabel,
  mainNavigation,
  mobileTabs,
  quickActions,
} from '../../constants/navigation'
import { ROUTES } from '../../constants/routes'
import { useTheme } from '../../hooks/useTheme'
import { BottomNavBar } from '../mobile/BottomNavBar'
import { MobileMenuSheet } from '../mobile/MobileMenuSheet'
import { MobileTopbar } from '../mobile/MobileTopbar'
import { QuickCreateSheet } from '../mobile/QuickCreateSheet'
import { Sidebar } from '../sidebar/Sidebar'
import { Topbar } from '../topbar/Topbar'

// Which mobile bottom sheet is open, if any (only one can be open at a time)
type OpenSheet = 'none' | 'create' | 'menu'

// No admin roles yet (see Phase 14), so everyone logged in shows the same role label
const USER_ROLE = 'Administrator'

export function DashboardLayout() {
  const { admin, logout } = useAuth()
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [openSheet, setOpenSheet] = useState<OpenSheet>('none')

  const userName = admin?.name || 'Admin'

  // Build the breadcrumbs from the current URL, e.g. '/rides' -> Elite Rides > Rides
  const pageLabel = getNavItemLabel(location.pathname) || 'Page not found'
  const breadcrumbs = ['Elite Rides', pageLabel]

  // Push the content right by the sidebar's width (desktop only)
  const contentOffset = isSidebarCollapsed ? 'lg:pl-[84px]' : 'lg:pl-[272px]'

  function closeSheet() {
    setOpenSheet('none')
  }

  // Tapping a bottom-bar button again closes its sheet
  function toggleSheet(sheet: OpenSheet) {
    setOpenSheet(openSheet === sheet ? 'none' : sheet)
  }

  function handleSignOut() {
    logout()
    navigate(ROUTES.login)
  }

  return (
    <div className="min-h-dvh bg-canvas">
      {/* Desktop (lg and up): sidebar + topbar */}
      <Sidebar
        sections={mainNavigation}
        footerItems={footerNavigation}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      <div className={`transition-[padding] duration-300 ease-out ${contentOffset}`}>
        <Topbar
          breadcrumbs={breadcrumbs}
          theme={theme}
          onThemeToggle={toggleTheme}
          hasUnreadNotifications
          userName={userName}
          userRole={USER_ROLE}
          onSignOut={handleSignOut}
        />

        {/* Phones and tablets: app-style top bar */}
        <MobileTopbar
          pageTitle={pageLabel}
          hasUnreadNotifications
          userName={userName}
          onAvatarClick={() => setOpenSheet('menu')}
        />

        {/* The large bottom padding on mobile keeps content clear of the bottom nav bar */}
        <main className="mx-auto w-full max-w-[1440px] px-4 pb-[calc(env(safe-area-inset-bottom)+112px)] pt-3 sm:px-6 lg:px-8 lg:py-8">
          {/* <Outlet /> renders the page that matches the current URL (see src/router.tsx).
              The `key` remounts the wrapper on every page change so the fade-in animation replays. */}
          <div key={location.pathname} className="motion-safe:animate-page-in">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Phones and tablets: bottom tab bar and its sheets */}
      <BottomNavBar
        tabs={mobileTabs}
        onCreateClick={() => toggleSheet('create')}
        onMenuClick={() => toggleSheet('menu')}
        isCreateOpen={openSheet === 'create'}
        isMenuOpen={openSheet === 'menu'}
      />

      <QuickCreateSheet isOpen={openSheet === 'create'} onClose={closeSheet} actions={quickActions} />

      <MobileMenuSheet
        isOpen={openSheet === 'menu'}
        onClose={closeSheet}
        sections={mainNavigation}
        footerItems={footerNavigation}
        theme={theme}
        onThemeToggle={toggleTheme}
        userName={userName}
        userRole={USER_ROLE}
        onSignOut={handleSignOut}
      />

      {/* Scrolls back to the top when moving to a new page, like switching tabs in an app */}
      <ScrollRestoration />
    </div>
  )
}
