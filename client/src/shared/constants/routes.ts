// Every URL of the website lives here, so a path only ever needs to change in one place
export const ROUTES = {
  home: '/',
  // Booking step 2: prices for every vehicle
  chooseVehicle: '/booking/vehicles',
  // Booking step 3: extras, passenger details, coupon and payment
  bookingDetails: '/booking/details',
  // After booking: thank-you page
  bookingConfirmation: '/booking/confirmation',
  // One airport: photos, description and address (build the link with buildAirportLink)
  airportDetails: '/airports/:airportId',
  // One tour: photos, description, vehicles with prices, date and time (build the link with buildTourLink)
  tourDetails: '/tours/:tourId',
  // All published blogs
  blogs: '/blogs',
  // One blog (build the link with buildBlogLink)
  blogDetails: '/blogs/:slug',
  // Tour booking step 2: passenger details and payment
  tourBooking: '/tour-booking',
}
