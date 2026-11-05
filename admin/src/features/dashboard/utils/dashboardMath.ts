import type { TrendPoint } from '../types/dashboard'

// How much a number changed, as a fraction: 110 vs 100 → 0.1 (+10%)
export function getChange(current: number, previous: number): number {
  if (previous === 0) return 0
  return (current - previous) / previous
}

// Adds up the totals shown in the stat cards from the trend points
export function getTrendTotals(trend: TrendPoint[]) {
  const totals = {
    revenue: 0,
    previousRevenue: 0,
    bookings: 0,
    previousBookings: 0,
    airportBookings: 0,
    previousAirportBookings: 0,
    cancelledBookings: 0,
    previousCancelledBookings: 0,
  }

  for (const point of trend) {
    totals.revenue += point.revenue
    totals.previousRevenue += point.previousRevenue
    totals.bookings += point.bookings
    totals.previousBookings += point.previousBookings
    totals.airportBookings += point.airportBookings
    totals.previousAirportBookings += point.previousAirportBookings
    totals.cancelledBookings += point.cancelledBookings
    totals.previousCancelledBookings += point.previousCancelledBookings
  }

  return totals
}

// Revenue divided by bookings, e.g. £7,200 / 100 bookings → £72
export function getAverageFare(revenue: number, bookings: number): number {
  if (bookings === 0) return 0
  return revenue / bookings
}
