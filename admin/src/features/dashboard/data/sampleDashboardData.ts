import type { DashboardData, DateRange, TopRoute, TrendPoint } from '../types/dashboard'

// Placeholder numbers so the dashboard has something to show.
// TODO: replace getSampleDashboardData with a React Query hook that calls the
// backend's dashboard endpoint once it exists. The returned shape stays the same.

type PointUnit = 'day' | 'week' | 'month'

type RangeSettings = {
  // How many points the trend chart has
  pointCount: number
  // How long each point covers
  unit: PointUnit
  // Roughly how many bookings one point has
  bookingsPerPoint: number
}

const RANGE_SETTINGS: Record<DateRange, RangeSettings> = {
  '7d': { pointCount: 7, unit: 'day', bookingsPerPoint: 48 },
  '30d': { pointCount: 30, unit: 'day', bookingsPerPoint: 46 },
  '90d': { pointCount: 13, unit: 'week', bookingsPerPoint: 318 },
  '12m': { pointCount: 12, unit: 'month', bookingsPerPoint: 1340 },
}

// Share of bookings per vehicle, biggest first. The smaller vehicle types
// are grouped into "Other" so the chart stays easy to read.
const VEHICLE_SHARES = [
  { vehicleName: 'Saloon', share: 0.36 },
  { vehicleName: 'Executive Saloon', share: 0.15 },
  { vehicleName: 'MPV', share: 0.14 },
  { vehicleName: 'Estate', share: 0.11 },
  { vehicleName: 'MPV Plus', share: 0.07 },
  { vehicleName: 'Minibus 8 Seater', share: 0.06 },
  { vehicleName: 'Other', share: 0.11 },
]

// How busy each hour of the day is, from 00:00 to 23:00.
// Early-morning airport runs and the evening rush are the peaks.
const HOURLY_WEIGHTS = [4, 3, 2, 2, 5, 12, 18, 16, 10, 8, 7, 7, 8, 8, 9, 11, 14, 17, 16, 12, 10, 9, 7, 5]

const TOP_ROUTES = [
  { id: 'lhr-london', from: 'Heathrow Airport', to: 'Central London', share: 0.14, averageFare: 82 },
  { id: 'lgw-london', from: 'Gatwick Airport', to: 'Central London', share: 0.09, averageFare: 96 },
  { id: 'london-stn', from: 'Central London', to: 'Stansted Airport', share: 0.06, averageFare: 118 },
  { id: 'lcy-canary', from: 'London City Airport', to: 'Canary Wharf', share: 0.05, averageFare: 48 },
  { id: 'ltn-watford', from: 'Luton Airport', to: 'Watford', share: 0.035, averageFare: 56 },
]

// Gives a repeatable "random-looking" number between 0 and 1.
// The same index and seed always give the same result, so the sample
// charts look natural but don't change every time the page renders.
function wobble(index: number, seed: number): number {
  const x = Math.sin(index * 12.9898 + seed * 78.233) * 43758.5453
  return x - Math.floor(x)
}

// The x-axis label for a point, counting back from today.
// e.g. day/week → "12 Oct", month → "Nov"
function getPointLabel(unit: PointUnit, stepsBack: number): string {
  const date = new Date()

  if (unit === 'month') {
    date.setMonth(date.getMonth() - stepsBack)
    return date.toLocaleDateString('en-GB', { month: 'short' })
  }

  const daysBack = unit === 'week' ? stepsBack * 7 : stepsBack
  date.setDate(date.getDate() - daysBack)
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

function createTrend(settings: RangeSettings): TrendPoint[] {
  const trend: TrendPoint[] = []
  // A different seed per range so each range looks different
  const seed = settings.pointCount

  for (let index = 0; index < settings.pointCount; index++) {
    // A gentle upward drift so the chart shows steady growth
    const growth = 1 + (index / settings.pointCount) * 0.12
    // A slow wave of busier and quieter stretches, plus a little day-to-day variation
    const wave = Math.sin(index / 2.2) * 0.08
    const bookings = Math.round(settings.bookingsPerPoint * growth * (0.92 + wave + 0.14 * wobble(index, seed + 1)))
    const averageFare = 70 + 6 * wobble(index, seed + 2)
    const previousBookings = Math.round(settings.bookingsPerPoint * (0.88 + wave * 0.6 + 0.12 * wobble(index, seed + 3)))
    const previousAverageFare = 66 + 6 * wobble(index, seed + 4)

    trend.push({
      label: getPointLabel(settings.unit, settings.pointCount - 1 - index),
      revenue: Math.round(bookings * averageFare),
      previousRevenue: Math.round(previousBookings * previousAverageFare),
      bookings,
      previousBookings,
      airportBookings: Math.round(bookings * (0.38 + 0.1 * wobble(index, seed + 5))),
      previousAirportBookings: Math.round(previousBookings * (0.36 + 0.1 * wobble(index, seed + 6))),
      cancelledBookings: Math.round(bookings * (0.025 + 0.02 * wobble(index, seed + 7))),
      previousCancelledBookings: Math.round(previousBookings * (0.035 + 0.02 * wobble(index, seed + 8))),
    })
  }

  return trend
}

export function getSampleDashboardData(dateRange: DateRange): DashboardData {
  const trend = createTrend(RANGE_SETTINGS[dateRange])

  let totalBookings = 0
  let totalRevenue = 0
  for (const point of trend) {
    totalBookings += point.bookings
    totalRevenue += point.revenue
  }

  const vehicleBookings = VEHICLE_SHARES.map((vehicle) => ({
    vehicleName: vehicle.vehicleName,
    bookings: Math.round(totalBookings * vehicle.share),
  }))

  const hourlyWeightTotal = HOURLY_WEIGHTS.reduce((sum, weight) => sum + weight, 0)
  const hourlyBookings = HOURLY_WEIGHTS.map((weight, hour) => ({
    // 6 → "06:00"
    hour: `${String(hour).padStart(2, '0')}:00`,
    bookings: Math.round((totalBookings * weight) / hourlyWeightTotal),
  }))

  // Card customers tend to book longer trips, so they bring in a bigger share of revenue
  const cardBookings = Math.round(totalBookings * 0.78)
  const cardRevenue = Math.round(totalRevenue * 0.84)
  const paymentMethods = [
    { method: 'pay_card' as const, bookings: cardBookings, revenue: cardRevenue },
    { method: 'pay_cash' as const, bookings: totalBookings - cardBookings, revenue: totalRevenue - cardRevenue },
  ]

  const topRoutes: TopRoute[] = TOP_ROUTES.map((route) => {
    const bookings = Math.round(totalBookings * route.share)
    return { id: route.id, from: route.from, to: route.to, bookings, revenue: bookings * route.averageFare }
  })

  return { trend, vehicleBookings, hourlyBookings, paymentMethods, topRoutes }
}
