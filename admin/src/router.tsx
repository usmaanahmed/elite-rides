import { createBrowserRouter } from 'react-router'
import { BanAddressesPage } from './features/addresses/pages/BanAddressesPage'
import { NewBookingPage } from './features/bookings/pages/NewBookingPage'
import { PriceCheckerPage } from './features/priceChecker/pages/PriceCheckerPage'
import { CouponsPage } from './features/coupons/pages/CouponsPage'
import { CongestionAddressesPage } from './features/addresses/pages/CongestionAddressesPage'
import { DropdownAddressesPage } from './features/addresses/pages/DropdownAddressesPage'
import { LoginPage } from './features/auth/pages/LoginPage'
import { BookingsPage } from './features/bookings/pages/BookingsPage'
import { ApiTestPage } from './features/connection-test/pages/ApiTestPage'
import { DashboardPage } from './features/dashboard/pages/DashboardPage'
import { FixedPricePage } from './features/pricing/pages/FixedPricePage'
import { SettingsPage } from './features/settings/pages/SettingsPage'
import { SurchargeAddressesPage } from './features/surcharges/pages/SurchargeAddressesPage'
import { SurchargeNightPage } from './features/surcharges/pages/SurchargeNightPage'
import { SurchargeOnDatePage } from './features/surcharges/pages/SurchargeOnDatePage'
import { VehiclesMileagePage } from './features/vehicles/pages/VehiclesMileagePage'
import { DashboardLayout } from './shared/components/layout/DashboardLayout'
import { ProtectedRoute } from './shared/components/routing/ProtectedRoute'
import { ROUTES } from './shared/constants/routes'
import { ComingSoonPage } from './shared/pages/ComingSoonPage'
import { NotFoundPage } from './shared/pages/NotFoundPage'

// Everything except /login is nested inside ProtectedRoute, which sends
// anyone who is not logged in back to /login. DashboardLayout then renders
// the sidebar and topbar, and shows the current page where its <Outlet /> is.
export const router = createBrowserRouter([
  { path: ROUTES.login, element: <LoginPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: ROUTES.dashboard,
        element: <DashboardLayout />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: ROUTES.bookings, element: <BookingsPage /> },
          { path: ROUTES.newBooking, element: <NewBookingPage /> },
          { path: ROUTES.dropdownAddresses, element: <DropdownAddressesPage /> },
          { path: ROUTES.banAddresses, element: <BanAddressesPage /> },
          { path: ROUTES.congestionAddresses, element: <CongestionAddressesPage /> },
          { path: ROUTES.vehicles, element: <VehiclesMileagePage /> },
          { path: ROUTES.fixedPrices, element: <FixedPricePage /> },
          { path: ROUTES.surchargeAddresses, element: <SurchargeAddressesPage /> },
          { path: ROUTES.surchargeDates, element: <SurchargeOnDatePage /> },
          { path: ROUTES.surchargeNight, element: <SurchargeNightPage /> },
          { path: ROUTES.coupons, element: <CouponsPage /> },
          { path: ROUTES.priceChecker, element: <PriceCheckerPage /> },
          { path: ROUTES.settings, element: <SettingsPage /> },
          { path: ROUTES.help, element: <ComingSoonPage title="Help & Support" /> },
          { path: ROUTES.apiTest, element: <ApiTestPage /> },
          // '*' matches any URL not listed above
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
  },
])
