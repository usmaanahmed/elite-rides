import { TicketPercent, X } from 'lucide-react'
import { useState } from 'react'

type CouponSectionProps = {
  // The coupon already applied ("" = none)
  appliedCode: string
  isChecking: boolean
  // Why the last code didn't work ("" = no problem)
  errorMessage: string
  onApply: (code: string) => void
  onRemove: () => void
}

// A box for a coupon code. Applied coupons show as a chip that can be removed.
export function CouponSection({ appliedCode, isChecking, errorMessage, onApply, onRemove }: CouponSectionProps) {
  const [codeText, setCodeText] = useState('')

  function handleApply(): void {
    const code = codeText.trim().toUpperCase()
    if (code !== '') {
      onApply(code)
    }
  }

  if (appliedCode !== '') {
    return (
      <div className="flex items-center justify-between gap-3 rounded-2xl bg-accent-soft px-4 py-3 text-sm">
        <span className="flex items-center gap-2 font-semibold text-accent-ink">
          <TicketPercent className="size-4" strokeWidth={2} />
          Coupon {appliedCode} applied
        </span>
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove coupon"
          className="grid size-8 place-items-center rounded-full text-accent-ink transition hover:bg-white"
        >
          <X className="size-4" strokeWidth={2} />
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex gap-2">
        <input
          type="text"
          value={codeText}
          onChange={(event) => setCodeText(event.target.value)}
          onKeyDown={(event) => {
            // Enter applies the coupon instead of submitting the whole booking form
            if (event.key === 'Enter') {
              event.preventDefault()
              handleApply()
            }
          }}
          placeholder="Coupon code"
          aria-label="Coupon code"
          autoComplete="off"
          className="h-12 min-w-0 flex-1 rounded-xl border border-line bg-surface-muted px-4 text-base uppercase text-ink outline-none transition placeholder:normal-case placeholder:text-muted/60 focus:border-accent/50 focus:bg-surface focus:ring-4 focus:ring-accent/10 sm:text-sm"
        />
        <button
          type="button"
          onClick={handleApply}
          disabled={isChecking || codeText.trim() === ''}
          className="h-12 rounded-xl border border-line px-5 text-sm font-semibold text-ink transition hover:border-accent disabled:opacity-50"
        >
          {isChecking ? 'Checking…' : 'Apply'}
        </button>
      </div>
      {errorMessage && <p className="mt-2 text-sm font-medium text-danger">{errorMessage}</p>}
    </div>
  )
}
