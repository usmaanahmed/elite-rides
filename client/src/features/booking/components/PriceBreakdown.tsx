import { formatMoney } from '../../../shared/utils/formatMoney'
import type { PriceLine } from '../types/publicApi'

type PriceBreakdownProps = {
  lines: PriceLine[]
  total: number
}

// Every line of the price (fare, extras, discounts…) and the total
export function PriceBreakdown({ lines, total }: PriceBreakdownProps) {
  return (
    <ul className="divide-y divide-line text-sm">
      {lines.map((line, index) => (
        <li key={index} className="flex justify-between gap-3 py-2">
          <span className="text-muted">{line.label}</span>
          <span className={`tabular-nums ${line.amount < 0 ? 'text-accent-ink' : 'text-ink'}`}>
            {line.amount < 0 ? '−' : ''}
            {formatMoney(Math.abs(line.amount))}
          </span>
        </li>
      ))}
      <li className="flex justify-between gap-3 pt-3 text-base font-semibold text-ink">
        <span>Total</span>
        <span className="tabular-nums">{formatMoney(total)}</span>
      </li>
    </ul>
  )
}
