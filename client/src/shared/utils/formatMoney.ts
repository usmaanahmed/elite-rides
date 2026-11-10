// 59.5 -> "£59.50"
export function formatMoney(amount: number): string {
  return `£${amount.toFixed(2)}`
}
