type SidebarBrandProps = {
  name: string
  tagline: string
  isCollapsed: boolean
}

export function SidebarBrand({ name, tagline, isCollapsed }: SidebarBrandProps) {
  return (
    <div className={`flex h-[72px] shrink-0 items-center gap-3 ${isCollapsed ? 'justify-center' : 'px-5'}`}>
      <img src="/elite-logo.webp" alt="Elite Rides logo" className="size-10 shrink-0 rounded-xl bg-white object-contain" />

      <div className={`min-w-0 flex-1 ${isCollapsed ? 'hidden' : ''}`}>
        <p className="truncate text-[15px] font-semibold tracking-tight text-ink">{name}</p>
        <p className="truncate text-xs text-muted">{tagline}</p>
      </div>
    </div>
  )
}
