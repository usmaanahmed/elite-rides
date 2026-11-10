import type { SurchargeAmountType } from '../types/surcharge'

// Shows a surcharge amount as text, e.g. "£5.00" or "20%"
export function formatSurchargeAmount(amountType: SurchargeAmountType, amount: number): string {
  if (amountType === 'percent') {
    return `${amount}%`
  }
  return `£${amount.toFixed(2)}`
}
