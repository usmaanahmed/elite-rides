import { Sparkles } from 'lucide-react'
import { ChartCard } from '../../../shared/components/charts/ChartCard'
import { CHART_COLORS } from '../../../shared/components/charts/chartStyles'
import { formatCount, formatPercent, formatPounds } from '../../../shared/utils/formatNumbers'
import { PAYMENT_METHOD_LABELS } from '../../bookings/constants/paymentMethods'
import type { PaymentMethod } from '../../bookings/types/booking'
import type { PaymentMethodTotals } from '../types/dashboard'
import { getAverageFare } from '../utils/dashboardMath'

type PaymentMethodsCardProps = {
  paymentMethods: PaymentMethodTotals[]
  className?: string
}

// Each payment method keeps the same colour everywhere
const PAYMENT_METHOD_COLORS: Record<PaymentMethod, string> = {
  pay_card: CHART_COLORS.primary,
  pay_cash: CHART_COLORS.secondary,
}

// Card vs cash split, shown as one bar divided into coloured segments
export function PaymentMethodsCard({ paymentMethods, className = '' }: PaymentMethodsCardProps) {
  const totalBookings = paymentMethods.reduce((sum, item) => sum + item.bookings, 0)

  const card = paymentMethods.find((item) => item.method === 'pay_card')
  const cash = paymentMethods.find((item) => item.method === 'pay_cash')
  const cardShare = card && totalBookings > 0 ? card.bookings / totalBookings : 0

  // How much more card customers spend per trip than cash customers
  const fareDifference =
    card && cash ? getAverageFare(card.revenue, card.bookings) - getAverageFare(cash.revenue, cash.bookings) : 0

  return (
    <ChartCard title="Payment methods" description="How customers pay for their rides" className={className}>
      <div className="flex items-baseline gap-2">
        <p className="text-3xl font-semibold tracking-tight text-ink">{formatPercent(cardShare)}</p>
        <p className="text-xs text-muted">of bookings paid by card</p>
      </div>

      {/* The split bar. The 2px gap between segments keeps them visually separate. */}
      <div className="mt-4 flex h-3 gap-0.5" role="img" aria-label="Share of bookings by payment method">
        {paymentMethods.map((item) => (
          <div
            key={item.method}
            className="h-full rounded-full transition-[width] duration-500 ease-out"
            style={{
              width: `${totalBookings > 0 ? (item.bookings / totalBookings) * 100 : 0}%`,
              backgroundColor: PAYMENT_METHOD_COLORS[item.method],
            }}
          />
        ))}
      </div>

      <ul className="mt-6 space-y-4">
        {paymentMethods.map((item) => (
          <li key={item.method} className="flex items-center gap-3">
            <span
              className="size-2.5 shrink-0 rounded-[3px]"
              style={{ backgroundColor: PAYMENT_METHOD_COLORS[item.method] }}
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-ink">{PAYMENT_METHOD_LABELS[item.method]}</p>
              <p className="text-xs tabular-nums text-muted">
                {formatCount(item.bookings)} bookings · {formatPercent(totalBookings > 0 ? item.bookings / totalBookings : 0)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold tabular-nums text-ink">{formatPounds(item.revenue)}</p>
              <p className="text-xs tabular-nums text-muted">
                avg {formatPounds(getAverageFare(item.revenue, item.bookings))}
              </p>
            </div>
          </li>
        ))}
      </ul>

      {fareDifference > 0 && (
        // mt-auto pushes the tip to the bottom of the card; pt-6 keeps a gap above it
        <div className="mt-auto pt-6">
          <div className="flex items-start gap-2.5 rounded-xl bg-accent-soft/70 p-3">
            <Sparkles className="mt-0.5 size-4 shrink-0 text-accent" strokeWidth={2} />
            <p className="text-xs leading-relaxed text-ink/80">
              Card customers spend <span className="font-semibold text-ink">{formatPounds(fareDifference)} more</span>{' '}
              per trip on average than cash customers.
            </p>
          </div>
        </div>
      )}
    </ChartCard>
  )
}
