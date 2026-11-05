export type SegmentedControlOption = {
  value: string
  label: string
}

type SegmentedControlProps = {
  options: SegmentedControlOption[]
  value: string
  onChange: (value: string) => void
  // Read out by screen readers, e.g. "Date range"
  label: string
  className?: string
}

// A row of buttons where exactly one is selected, like iOS's segmented control.
// Good for switching between a few views, e.g. 7D / 30D / 90D / 12M.
export function SegmentedControl({ options, value, onChange, label, className = '' }: SegmentedControlProps) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={`inline-flex h-10 items-center gap-0.5 rounded-xl border border-line bg-surface-muted p-1 ${className}`}
    >
      {options.map((option) => {
        const isSelected = option.value === value
        const stateClasses = isSelected
          ? 'bg-surface text-ink shadow-[0_1px_3px_rgba(16,24,40,0.1)] ring-1 ring-line'
          : 'text-muted hover:text-ink'

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(option.value)}
            className={`h-full flex-1 rounded-lg px-3 text-xs font-semibold transition-all ${stateClasses}`}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
