// Every URL in the app lives here, so a path only ever needs to change in one place
export const ROUTES = {
  login: '/login',
  dashboard: '/',
  bookings: '/bookings',
  newBooking: '/bookings/new',
  airports: '/airports',
  stations: '/stations',
  dropdownAddresses: '/dropdown-addresses',
  banAddresses: '/ban-addresses',
  congestionAddresses: '/congestion-addresses',
  vehicles: '/vehicles',
  fixedPrices: '/fixed-prices',
  priceChecker: '/price-checker',
  surchargeAddresses: '/surcharge-addresses',
  surchargeDates: '/surcharge-dates',
  surchargeNight: '/surcharge-night',
  coupons: '/coupons',
  blogs: '/blogs',
  newBlog: '/blogs/new',
  // ":blogId" is filled in with the real id, see getEditBlogPath
  editBlog: '/blogs/:blogId/edit',
  settings: '/settings',
  help: '/help',
  apiTest: '/api-test',
}

// The edit page address of one blog, e.g. '/blogs/123/edit'
export function getEditBlogPath(blogId: string): string {
  return ROUTES.editBlog.replace(':blogId', blogId)
}
