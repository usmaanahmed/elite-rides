import { useNavigate } from 'react-router'
import type { QuickAction } from '../../types/navigation'
import { BottomSheet } from '../sheets/BottomSheet'

type QuickCreateSheetProps = {
  isOpen: boolean
  onClose: () => void
  actions: QuickAction[]
}

// Sheet that opens from the centre "+" button with shortcuts for creating things
export function QuickCreateSheet({ isOpen, onClose, actions }: QuickCreateSheetProps) {
  const navigate = useNavigate()

  function handleActionClick(action: QuickAction) {
    navigate(action.path)
    onClose()
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Create new" description="What would you like to add?">
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <button
              key={action.label}
              type="button"
              onClick={() => handleActionClick(action)}
              className="flex flex-col items-start gap-3 rounded-2xl border border-line bg-surface p-4 text-left transition-transform duration-150 active:scale-[0.97]"
            >
              <span className="grid size-10 place-items-center rounded-xl bg-accent-soft text-accent">
                <Icon className="size-5" strokeWidth={2} />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold leading-tight text-ink">{action.label}</span>
                <span className="mt-1 block text-xs text-muted">{action.hint}</span>
              </span>
            </button>
          )
        })}
      </div>
    </BottomSheet>
  )
}
