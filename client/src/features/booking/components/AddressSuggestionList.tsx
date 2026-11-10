import { MapPin, Plane, TrainFront } from 'lucide-react'
import type { DropdownAddress } from '../types/publicApi'

type AddressSuggestionListProps = {
  // Airports and stations saved in the admin panel (shown first, in their own group)
  savedAddresses: DropdownAddress[]
  // Google's suggestions
  googleAddresses: string[]
  // Distance from the top of the parent box, in pixels
  top: number
  onSelect: (address: string) => void
}

// The dropdown of suggested addresses under an address box.
// Items use onMouseDown (not onClick) so the choice happens before the box loses focus and the list closes.
export function AddressSuggestionList({ savedAddresses, googleAddresses, top, onSelect }: AddressSuggestionListProps) {
  if (savedAddresses.length === 0 && googleAddresses.length === 0) {
    return null
  }

  return (
    <div
      role="listbox"
      style={{ top: `${top}px` }}
      className="absolute left-0 right-0 z-40 max-h-80 overflow-y-auto rounded-2xl border border-line bg-surface py-2 text-ink shadow-[0_24px_60px_-20px_rgba(0,0,0,0.45)] motion-safe:animate-fade-in"
    >
      {savedAddresses.length > 0 && (
        <div>
          <p className="px-4 pb-1 pt-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
            Airports &amp; stations
          </p>
          {savedAddresses.map((address) => {
            let Icon = MapPin
            if (address.type === 'airport') Icon = Plane
            if (address.type === 'station') Icon = TrainFront
            return (
              <button
                key={address.address}
                type="button"
                role="option"
                aria-selected={false}
                onMouseDown={(event) => {
                  event.preventDefault()
                  onSelect(address.address)
                }}
                className="flex w-full items-start gap-3 px-4 py-2.5 text-left text-sm transition-colors hover:bg-surface-muted"
              >
                <Icon className="mt-0.5 size-4 shrink-0 text-accent" strokeWidth={2} />
                <span>{address.address}</span>
              </button>
            )
          })}
        </div>
      )}

      {googleAddresses.length > 0 && (
        <div className={savedAddresses.length > 0 ? 'mt-1 border-t border-line pt-1' : ''}>
          {googleAddresses.map((address) => (
            <button
              key={address}
              type="button"
              role="option"
              aria-selected={false}
              onMouseDown={(event) => {
                event.preventDefault()
                onSelect(address)
              }}
              className="flex w-full items-start gap-3 px-4 py-2.5 text-left text-sm transition-colors hover:bg-surface-muted"
            >
              <MapPin className="mt-0.5 size-4 shrink-0 text-muted" strokeWidth={2} />
              <span>{address}</span>
            </button>
          ))}
          <p className="px-4 pt-1.5 text-right text-[11px] text-muted">Powered by Google</p>
        </div>
      )}
    </div>
  )
}
