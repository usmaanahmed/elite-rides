import type { ComponentProps } from 'react'

// Accepts every normal checkbox prop, so React Hook Form's
// `{...register('fieldName')}` can be spread straight onto it.
type ToggleSwitchProps = ComponentProps<'input'> & {
  label: string
}

// On/off switch with a label, e.g. "Return journey".
// It is a real checkbox underneath (hidden with sr-only), so keyboard and screen readers work.
// `peer-checked:` styles the track and knob when the checkbox is ticked.
export function ToggleSwitch({ label, ...inputProps }: ToggleSwitchProps) {
  return (
    <label className="inline-flex cursor-pointer select-none items-center gap-2.5">
      <span className="relative inline-flex">
        <input {...inputProps} type="checkbox" className="peer sr-only" />
        {/* Track */}
        <span className="h-6 w-10 rounded-full bg-line transition-colors peer-checked:bg-accent peer-focus-visible:ring-4 peer-focus-visible:ring-accent/25" />
        {/* Knob */}
        <span className="absolute left-0.5 top-0.5 size-5 rounded-full bg-surface shadow-sm transition-transform peer-checked:translate-x-4" />
      </span>
      <span className="text-sm font-semibold text-ink">{label}</span>
    </label>
  )
}
