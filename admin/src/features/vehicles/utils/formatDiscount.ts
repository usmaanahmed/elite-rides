// Turns a discount percentage into short text for badges, e.g. 10 -> "10% off", 0 -> "No discount"
export function formatDiscount(discountRate: number): string {
  if (discountRate > 0) {
    return `${discountRate}% off`
  }
  return 'No discount'
}
