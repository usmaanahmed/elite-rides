import { createBrowserRouter } from 'react-router'
import { BanAddressesPage } from './features/addresses/pages/BanAddressesPage'
import { DropdownAddressesPage } from './features/addresses/pages/DropdownAddressesPage'
import { BookingsPage } from './features/bookings/pages/BookingsPage'
import { ApiTestPage } from './features/connection-test/pages/ApiTestPage'
import { DashboardPage } from './features/dashboard/pages/DashboardPage'
import { FixedPricePage } from './features/pricing/pages/FixedPricePage'
import { HourlyRatePage } from './features/pricing/pages/HourlyRatePage'
import { SurchargeAddressesPage } from './features/surcharges/pages/SurchargeAddressesPage'
import { SurchargeOnDatePage } from './features/surcharges/pages/SurchargeOnDatePage'
import { VehiclesMileagePage } from './features/vehicles/pages/VehiclesMileagePage'
import { DashboardLayout } from './shared/components/layout/DashboardLayout'
import { ROUTES } from './shared/constants/routes'
import { ComingSoonPage } from './shared/pages/ComingSoonPage'
import { NotFoundPage } from './shared/pages/NotFoundPage'

// All pages are nested inside DashboardLayout, which renders the sidebar and topbar
// and shows the current page where its <Outlet /> is.
export const router = createBrowserRouter([
  {
    path: ROUTES.dashboard,
    element: <DashboardLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: ROUTES.bookings, element: <BookingsPage /> },
      { path: ROUTES.dropdownAddresses, element: <DropdownAddressesPage /> },
      { path: ROUTES.banAddresses, element: <BanAddressesPage /> },
      { path: ROUTES.vehicles, element: <VehiclesMileagePage /> },
      { path: ROUTES.fixedPrices, element: <FixedPricePage /> },
      { path: ROUTES.hourlyRates, element: <HourlyRatePage /> },
      { path: ROUTES.surchargeAddresses, element: <SurchargeAddressesPage /> },
      { path: ROUTES.surchargeDates, element: <SurchargeOnDatePage /> },
      { path: ROUTES.settings, element: <ComingSoonPage title="Settings" /> },
      { path: ROUTES.help, element: <ComingSoonPage title="Help & Support" /> },
      { path: ROUTES.apiTest, element: <ApiTestPage /> },
      // '*' matches any URL not listed above
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
