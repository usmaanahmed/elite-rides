import { ChevronDown, Clock3 } from 'lucide-react'
import type { UseFormRegisterReturn } from 'react-hook-form'
import { HOUR_OPTIONS, MINUTE_OPTIONS } from '../constants/bookingOptions'
import type { SelectOption } from '../types/booking'
import { FieldBox } from './FieldBox'

type TimeFieldProps = {
  // Id of the hour dropdown (the label points to it)
  id: string
  label: string
  // Results of register('...Hour') and register('...Minute')
  hourField: UseFormRegisterReturn
  minuteField: UseFormRegisterReturn
  error?: string
}

// Text style for the two small dropdowns. They size to their content ("23", "05").
const TIME_SELECT_CLASSES =
  'h-full cursor-pointer appearance-none bg-transparent px-1 text-base font-medium text-ink outline-none transition-colors hover:text-accent-ink sm:text-[15px]'

// One <option> per choice
function renderOptions(options: SelectOption[]) {
  return options.map((option) => (
    <option key={option.value} value={option.value}>
      {option.label}
    </option>
  ))
}

// Time picker as two dropdowns, "HH : MM", inside one FieldBox.
// Two dropdowns (instead of <input type="time">) show the same 24-hour format in every browser.
export function TimeField({ id, label, hourField, minuteField, error }: TimeFieldProps) {
  const describedBy = error ? `${id}-error` : undefined

  return (
    <FieldBox label={label} htmlFor={id} icon={Clock3} error={error}>
      <div className="flex h-full items-center pl-11 pr-10 pt-5">
        <select
          {...hourField}
          id={id}
          aria-label={`${label}, hour`}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={TIME_SELECT_CLASSES}
        >
          {renderOptions(HOUR_OPTIONS)}
        </select>
        <span className="font-semibold text-accent">:</span>
        <select
          {...minuteField}
          id={`${id}-minute`}
          aria-label={`${label}, minutes`}
          aria-describedby={describedBy}
          className={TIME_SELECT_CLASSES}
        >
          {renderOptions(MINUTE_OPTIONS)}
        </select>
      </div>
      {/* Arrow sits on the value line, same as SelectField */}
      <ChevronDown
        className="pointer-events-none absolute right-4 top-[39px] size-4 -translate-y-1/2 text-muted"
        strokeWidth={2}
      />
    </FieldBox>
  )
}
