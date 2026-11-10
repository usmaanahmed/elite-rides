import { createBrowserRouter } from 'react-router'
import { BookingConfirmationPage } from './features/booking/pages/BookingConfirmationPage'
import { BookingDetailsPage } from './features/booking/pages/BookingDetailsPage'
import { ChooseVehiclePage } from './features/booking/pages/ChooseVehiclePage'
import { HomePage } from './features/home/pages/HomePage'
import { ROUTES } from './shared/constants/routes'

// Every page of the website. Unknown URLs show the home page.
export const router = createBrowserRouter([
  { path: ROUTES.home, element: <HomePage /> },
  { path: ROUTES.chooseVehicle, element: <ChooseVehiclePage /> },
  { path: ROUTES.bookingDetails, element: <BookingDetailsPage /> },
  { path: ROUTES.bookingConfirmation, element: <BookingConfirmationPage /> },
  { path: '*', element: <HomePage /> },
])
