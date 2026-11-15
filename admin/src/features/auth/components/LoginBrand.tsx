import { BRAND_NAME } from '../constants/brand'

// Logo + brand name in white, made to sit on top of the dark login photo
export function LoginBrand() {
  return (
    <div className="flex items-center gap-3">
      <img src="/elite-logo.webp" alt="Elite London Rides logo" className="size-12 shrink-0 rounded-xl bg-white object-contain" />

      <div className="leading-tight">
        <p className="text-[15px] font-semibold tracking-tight text-white">{BRAND_NAME}</p>
        <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/80">Book Your Ride Instantly</p>
      </div>
    </div>
  )
}
