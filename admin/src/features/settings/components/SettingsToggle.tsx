import { Controller, useFormContext } from 'react-hook-form'
import { Switch } from '../../../shared/components/inputs/Switch'
import type { SettingsFormValues } from '../types/settings'

// Only the on/off settings can use the toggle
type ToggleName =
  | 'pricing.mileageBySlabs'
  | 'pricing.roundOff'
  | 'pricing.showCard'
  | 'pricing.showCash'
  | 'general.guestLogin'
  | 'general.hourlyRateStatus'
  | 'general.isQuotation'

type SettingsToggleProps = {
  name: ToggleName
  label: string
  description: string
}

// One row with a label on the left and an on/off switch on the right
export function SettingsToggle({ name, label, description }: SettingsToggleProps) {
  const { control } = useFormContext<SettingsFormValues>()

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <button
          type="button"
          role="switch"
          aria-checked={field.value}
          onClick={() => field.onChange(!field.value)}
          className="flex w-full items-center justify-between gap-4 rounded-xl text-left"
        >
          <span>
            <span className="block text-sm font-medium text-ink">{label}</span>
            <span className="block text-xs text-muted">{description}</span>
          </span>
          <Switch isOn={field.value} />
        </button>
      )}
    />
  )
}
