import { ChevronDown } from 'lucide-react'
import type { SelectOption } from '../../../../shared/components/inputs/SelectInput'

type ToolbarSelectProps = {
  label: string
  options: SelectOption[]
  value: string
  onChange: (value: string) => void
  // Tailwind width class, e.g. "w-32"
  widthClass: string
}

// A small dropdown in the editor toolbar, e.g. "Heading 2" or the text size
export function ToolbarSelect({ label, options, value, onChange, widthClass }: ToolbarSelectProps) {
  return (
    <div className={`relative shrink-0 ${widthClass}`}>
      <select
        aria-label={label}
        title={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-8 w-full cursor-pointer appearance-none rounded-lg bg-transparent pl-2.5 pr-7 text-[13px] font-medium text-ink outline-none transition-colors hover:bg-nav-hover focus-visible:ring-2 focus-visible:ring-accent/30"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 size-3.5 -translate-y-1/2 text-muted" strokeWidth={2} />
    </div>
  )
}
