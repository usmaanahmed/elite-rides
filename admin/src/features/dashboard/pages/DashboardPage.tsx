import { CalendarCheck, CircleX, Download, Plane, Plus, Receipt } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../../../shared/components/buttons/Button'
import { StatCard } from '../../../shared/components/cards/StatCard'
import { SegmentedControl } from '../../../shared/components/inputs/SegmentedControl'
import { PageHeader } from '../../../shared/components/PageHeader'
import { formatCount, formatPounds } from '../../../shared/utils/formatNumbers'
import { SAMPLE_BOOKINGS } from '../../bookings/data/sampleBookings'
import { PaymentMethodsCard } from '../components/PaymentMethodsCard'
import { PeakHoursCard } from '../components/PeakHoursCard'
import { RecentBookingsCard } from '../components/RecentBookingsCard'
import { RevenueOverviewCard } from '../components/RevenueOverviewCard'
import { TopRoutesCard } from '../components/TopRoutesCard'
import { VehicleMixCard } from '../components/VehicleMixCard'
import { COMPARISON_LABELS, DATE_RANGE_LABELS, DATE_RANGE_OPTIONS } from '../constants/dateRanges'
import { getSampleDashboardData } from '../data/sampleDashboardData'
import type { DateRange } from '../types/dashboard'
import { getAverageFare, getChange, getTrendTotals } from '../utils/dashboardMath'

const RECENT_BOOKINGS_COUNT = 6

export function DashboardPage() {
  const [dateRange, setDateRange] = useState<DateRange>('30d')

  // TODO: load from the backend with React Query once the dashboard endpoint exists
  const data = getSampleDashboardData(dateRange)
  const comparisonLabel = COMPARISON_LABELS[dateRange]

  const totals = getTrendTotals(data.trend)
  const averageFare = getAverageFare(totals.revenue, totals.bookings)
  const previousAverageFare = getAverageFare(totals.previousRevenue, totals.previousBookings)

  // Newest pickups first. Copy the list before sorting so the original isn't changed.
  const recentBookings = [...SAMPLE_BOOKINGS]
    .sort((a, b) => b.pickupAt.localeCompare(a.pickupAt))
    .slice(0, RECENT_BOOKINGS_COUNT)

  return (
    <>
      <PageHeader
        title="Dashboard"
        description={`How Elite Rides is performing over ${DATE_RANGE_LABELS[dateRange]}.`}
        actions={
          <>
            {/* The date range applies to every number and chart on the page */}
            <SegmentedControl
              label="Date range"
              options={DATE_RANGE_OPTIONS}
              value={dateRange}
              onChange={(value) => setDateRange(value as DateRange)}
              className="w-full sm:w-auto"
            />
            <Button variant="secondary" icon={Download}>
              Export
            </Button>
            <Button icon={Plus}>New booking</Button>
          </>
        }
      />

      {/* Two stat cards per row on phones, like a native app's summary tiles */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:gap-5 xl:grid-cols-4">
        <StatCard
          label="Total bookings"
          value={formatCount(totals.bookings)}
          icon={CalendarCheck}
          change={getChange(totals.bookings, totals.previousBookings)}
          comparisonLabel={comparisonLabel}
          trend={data.trend.map((point) => point.bookings)}
        />
        <StatCard
          label="Average fare"
          value={formatPounds(averageFare)}
          icon={Receipt}
          change={getChange(averageFare, previousAverageFare)}
          comparisonLabel={comparisonLabel}
          trend={data.trend.map((point) => getAverageFare(point.revenue, point.bookings))}
        />
        <StatCard
          label="Airport transfers"
          value={formatCount(totals.airportBookings)}
          icon={Plane}
          change={getChange(totals.airportBookings, totals.previousAirportBookings)}
          comparisonLabel={comparisonLabel}
          trend={data.trend.map((point) => point.airportBookings)}
        />
        <StatCard
          label="Cancelled rides"
          value={formatCount(totals.cancelledBookings)}
          icon={CircleX}
          change={getChange(totals.cancelledBookings, totals.previousCancelledBookings)}
          // Fewer cancellations is good, so a drop shows in green
          isUpGood={false}
          comparisonLabel={comparisonLabel}
          trend={data.trend.map((point) => point.cancelledBookings)}
        />
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 sm:mt-5 sm:gap-5 xl:grid-cols-3">
        <RevenueOverviewCard trend={data.trend} comparisonLabel={comparisonLabel} className="xl:col-span-2" />
        <VehicleMixCard vehicleBookings={data.vehicleBookings} />
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 sm:mt-5 sm:gap-5 xl:grid-cols-3">
        <PeakHoursCard hourlyBookings={data.hourlyBookings} className="xl:col-span-2" />
        <PaymentMethodsCard paymentMethods={data.paymentMethods} />
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 sm:mt-5 sm:gap-5 xl:grid-cols-3">
        <RecentBookingsCard bookings={recentBookings} className="xl:col-span-2" />
        <TopRoutesCard routes={data.topRoutes} totalBookings={totals.bookings} />
      </div>
    </>
  )
}
