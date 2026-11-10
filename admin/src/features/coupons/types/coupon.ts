// percent = a percentage off the fare, fixed = a flat amount in pounds off
export type CouponDiscountType = 'percent' | 'fixed'

// Inactive coupons are kept but cannot be used
export type CouponStatus = 'active' | 'inactive'

// The values exactly as they sit in the Coupon form (numbers stay text while typing)
export type CouponFormValues = {
  code: string
  discountType: CouponDiscountType
  discountValue: string
  // "YYYY-MM-DD". Empty = never expires.
  expiryDate: string
  // Empty or 0 = unlimited
  usageLimit: string
  status: CouponStatus
}

// A coupon ready to be sent to the server
export type NewCoupon = {
  // Uppercase letters and numbers, e.g. "SAVE10"
  code: string
  discountType: CouponDiscountType
  // Pounds when discountType is "fixed", a percentage when it is "percent"
  discountValue: number
  expiryDate: string
  // 0 = unlimited
  usageLimit: number
  status: CouponStatus
}

// A coupon as saved on the server
export type Coupon = NewCoupon & {
  id: string
  // How many times it has been used
  usedCount: number
  // Total pounds of discount this coupon has given so far
  totalDiscountGiven: number
}

// The numbers in the 4 cards at the top of the Coupons page
export type CouponStats = {
  totalCoupons: number
  activeCoupons: number
  totalUsage: number
  totalDiscountGiven: number
}
