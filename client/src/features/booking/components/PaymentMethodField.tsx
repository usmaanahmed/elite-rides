import { Banknote, CreditCard } from 'lucide-react'
import type { UseFormRegisterReturn } from 'react-hook-form'

type PaymentMethodFieldProps = {
  // register('paymentMethod') from the form
  field: UseFormRegisterReturn
  showPayInCar: boolean
  showCard: boolean
  error?: string
}

// The payment choices the office has switched on in the admin settings
export function PaymentMethodField({ field, showPayInCar, showCard, error }: PaymentMethodFieldProps) {
  const optionClasses =
    'flex cursor-pointer items-center gap-3 rounded-2xl border border-line bg-surface-muted p-4 transition has-checked:border-accent has-checked:bg-accent-soft'

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2">
        {showPayInCar && (
          <label className={optionClasses}>
            <input type="radio" value="pay_cash" className="size-4 accent-accent" {...field} />
            <Banknote className="size-5 text-accent" strokeWidth={1.75} />
            <span>
              <span className="block text-sm font-semibold text-ink">Pay in car</span>
              <span className="block text-xs text-muted">Cash or card to the driver</span>
            </span>
          </label>
        )}
        {showCard && (
          <label className={optionClasses}>
            <input type="radio" value="pay_card" className="size-4 accent-accent" {...field} />
            <CreditCard className="size-5 text-accent" strokeWidth={1.75} />
            <span>
              <span className="block text-sm font-semibold text-ink">Pay by card</span>
              <span className="block text-xs text-muted">Secure online payment</span>
            </span>
          </label>
        )}
      </div>
      {error && <p className="mt-2 text-sm font-medium text-danger">{error}</p>}
    </div>
  )
}
