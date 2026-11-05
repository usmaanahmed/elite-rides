import type { PaymentMethod } from '../../bookings/types/booking'

// The period the dashboard covers
export type DateRange = '7d' | '30d' | '90d' | '12m'

// One point on the trend charts: a day, a week or a month depending on the range
export type TrendPoint = {
  // Shown on the chart's x-axis, e.g. "12 Oct" or "Nov"
  label: string
  // In pounds
  revenue: number
  // Revenue for the same point in the previous period, for comparison
  previousRevenue: number
  bookings: number
  previousBookings: number
  airportBookings: number
  previousAirportBookings: number
  cancelledBookings: number
  previousCancelledBookings: number
}

export type VehicleBookings = {
  vehicleName: string
  bookings: number
}

export type HourlyBookings = {
  // Start of the hour, e.g. "06:00"
  hour: string
  bookings: number
}

export type PaymentMethodTotals = {
  method: PaymentMethod
  bookings: number
  // In pounds
  revenue: number
}

export type TopRoute = {
  id: string
  from: string
  to: string
  bookings: number
  // In pounds
  revenue: number
}

// Everything the dashboard shows for one date range
export type DashboardData = {
  trend: TrendPoint[]
  vehicleBookings: VehicleBookings[]
  hourlyBookings: HourlyBookings[]
  paymentMethods: PaymentMethodTotals[]
  topRoutes: TopRoute[]
}
