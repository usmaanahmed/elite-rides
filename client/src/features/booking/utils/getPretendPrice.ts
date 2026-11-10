import type { PublicSettings } from '../types/publicApi'

// The crossed-out "was" price shown next to the real price, when the office has set a pretend discount.
// It is only for show: the customer always pays the real price. Gives null when there is none.
export function getPretendPrice(realPrice: number, settings: PublicSettings): number | null {
  if (settings.pretendDiscountType === 'none' || settings.pretendDiscountValue <= 0) {
    return null
  }

  if (settings.pretendDiscountType === 'fixed') {
    return realPrice + settings.pretendDiscountValue
  }

  return realPrice * (1 + settings.pretendDiscountValue / 100)
}
