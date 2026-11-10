import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { addCoupon, editCoupon, getCouponStats, getCoupons } from '../api/couponsApi'
import type { NewCoupon } from '../types/coupon'

// The names React Query uses to store the coupons and their stats in its cache
export const COUPONS_QUERY_KEY = ['coupons']
export const COUPON_STATS_QUERY_KEY = ['coupon-stats']

// Loads the coupons. Gives back the list plus loading / error info.
export function useCoupons() {
  return useQuery({
    queryKey: COUPONS_QUERY_KEY,
    queryFn: getCoupons,
  })
}

// Loads the numbers for the 4 stat cards
export function useCouponStats() {
  return useQuery({
    queryKey: COUPON_STATS_QUERY_KEY,
    queryFn: getCouponStats,
  })
}

// Saves a new coupon, then reloads the list and stats
export function useAddCoupon() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addCoupon,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COUPONS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: COUPON_STATS_QUERY_KEY })
    },
  })
}

// Saves changes to a coupon (this is also how it is switched Active / Inactive), then reloads the list and stats
export function useEditCoupon() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ couponId, coupon }: { couponId: string; coupon: NewCoupon }) => editCoupon(couponId, coupon),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COUPONS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: COUPON_STATS_QUERY_KEY })
    },
  })
}
