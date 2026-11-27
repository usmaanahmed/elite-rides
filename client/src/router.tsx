import { createBrowserRouter } from 'react-router'
import { AirportDetailsPage } from './features/airports/pages/AirportDetailsPage'
import { BlogDetailsPage } from './features/blogs/pages/BlogDetailsPage'
import { BlogsPage } from './features/blogs/pages/BlogsPage'
import { BookingConfirmationPage } from './features/booking/pages/BookingConfirmationPage'
import { BookingDetailsPage } from './features/booking/pages/BookingDetailsPage'
import { ChooseVehiclePage } from './features/booking/pages/ChooseVehiclePage'
import { HomePage } from './features/home/pages/HomePage'
import { TourBookingPage } from './features/tours/pages/TourBookingPage'
import { TourDetailsPage } from './features/tours/pages/TourDetailsPage'
import { ROUTES } from './shared/constants/routes'

// Every page of the website. Unknown URLs show the home page.
export const router = createBrowserRouter([
  { path: ROUTES.home, element: <HomePage /> },
  { path: ROUTES.chooseVehicle, element: <ChooseVehiclePage /> },
  { path: ROUTES.bookingDetails, element: <BookingDetailsPage /> },
  { path: ROUTES.bookingConfirmation, element: <BookingConfirmationPage /> },
  { path: ROUTES.airportDetails, element: <AirportDetailsPage /> },
  { path: ROUTES.tourDetails, element: <TourDetailsPage /> },
  { path: ROUTES.blogs, element: <BlogsPage /> },
  { path: ROUTES.blogDetails, element: <BlogDetailsPage /> },
  { path: ROUTES.tourBooking, element: <TourBookingPage /> },
  { path: '*', element: <HomePage /> },
])
