import { CarFront } from 'lucide-react'
import { BRAND_NAME } from '../constants/brand'

// Logo + brand name in white, made to sit on top of the dark login photo
export function LoginBrand() {
  return (
    <div className="flex items-center gap-3">
      <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-linear-to-br from-[#ff8a3d] to-[#e04f00] text-white shadow-[0_8px_20px_-6px_rgba(252,98,3,0.8)] ring-1 ring-white/20">
        <CarFront className="size-5" strokeWidth={2} />
      </div>

      <div className="leading-tight">
        <p className="text-[15px] font-semibold tracking-tight text-white">{BRAND_NAME}</p>
        <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/80">Book Your Ride Instantly</p>
      </div>
    </div>
  )
}
