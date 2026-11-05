import { CarFront } from 'lucide-react'

type SidebarBrandProps = {
  name: string
  tagline: string
  isCollapsed: boolean
}

export function SidebarBrand({ name, tagline, isCollapsed }: SidebarBrandProps) {
  return (
    <div className={`flex h-[72px] shrink-0 items-center gap-3 ${isCollapsed ? 'justify-center' : 'px-5'}`}>
      <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-linear-to-br from-[#ff8a3d] to-[#e04f00] text-white shadow-[0_6px_16px_-6px_rgba(252,98,3,0.7)]">
        <CarFront className="size-[18px]" strokeWidth={2} />
      </div>

      <div className={`min-w-0 flex-1 ${isCollapsed ? 'hidden' : ''}`}>
        <p className="truncate text-[15px] font-semibold tracking-tight text-ink">{name}</p>
        <p className="truncate text-xs text-muted">{tagline}</p>
      </div>
    </div>
  )
}
