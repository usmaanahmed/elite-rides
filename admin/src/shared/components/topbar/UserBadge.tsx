import { ChevronDown } from 'lucide-react'
import { getInitials } from '../../utils/getInitials'

type UserBadgeProps = {
  name: string
  role: string
  onClick?: () => void
}

export function UserBadge({ name, role, onClick }: UserBadgeProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-3 rounded-xl py-1 pl-1 pr-2 transition-colors hover:bg-nav-hover"
    >
      {/* Brand-colour ring around the avatar for a premium touch */}
      <span className="rounded-full bg-linear-to-br from-[#ff8a3d] to-[#e04f00] p-[2px]">
        <span className="grid size-8 place-items-center rounded-full bg-surface text-xs font-semibold text-ink">
          {getInitials(name)}
        </span>
      </span>

      <span className="hidden text-left sm:block">
        <span className="block text-sm font-semibold leading-tight text-ink">{name}</span>
        <span className="block text-xs leading-tight text-muted">{role}</span>
      </span>

      <ChevronDown className="hidden size-4 text-muted sm:block" />
    </button>
  )
}
