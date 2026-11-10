import { apiFetch } from '../../../shared/api/apiFetch'
import { readJsonResponse } from '../../../shared/api/readJsonResponse'
import type { Coupon, CouponStats, NewCoupon } from '../types/coupon'

// Loads all coupons
export async function getCoupons(): Promise<Coupon[]> {
  const response = await apiFetch('/coupons')
  return (await readJsonResponse(response)) as Coupon[]
}

// Loads the numbers for the stat cards
export async function getCouponStats(): Promise<CouponStats> {
  const response = await apiFetch('/coupons/stats')
  return (await readJsonResponse(response)) as CouponStats
}

// Saves a new coupon
export async function addCoupon(coupon: NewCoupon): Promise<Coupon> {
  const response = await apiFetch('/coupons', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(coupon),
  })
  return (await readJsonResponse(response)) as Coupon
}

// Saves changes to an existing coupon
export async function editCoupon(couponId: string, coupon: NewCoupon): Promise<Coupon> {
  const response = await apiFetch(`/coupons/${couponId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(coupon),
  })
  return (await readJsonResponse(response)) as Coupon
}
