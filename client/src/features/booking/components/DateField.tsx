import { CalendarDays } from 'lucide-react'
import type { ComponentProps, MouseEvent } from 'react'
import { FIELD_CONTROL_CLASSES } from '../constants/fieldStyles'
import { FieldBox } from './FieldBox'

// Accepts every normal <input> prop, so React Hook Form's
// `{...register('fieldName')}` can be spread straight onto it.
type DateFieldProps = ComponentProps<'input'> & {
  id: string
  label: string
  error?: string
}

// Opens the calendar when the field is clicked anywhere, not only on the small calendar icon.
// Some older browsers don't support showPicker(); they still open the calendar from the icon.
function openCalendar(event: MouseEvent<HTMLInputElement>): void {
  try {
    event.currentTarget.showPicker()
  } catch {
    // Nothing to do — the browser's normal behaviour still works
  }
}

// Date picker inside a FieldBox. Pass `min` to block earlier dates.
export function DateField({ id, label, error, ...inputProps }: DateFieldProps) {
  return (
    <FieldBox label={label} htmlFor={id} icon={CalendarDays} error={error}>
      <input
        {...inputProps}
        id={id}
        type="date"
        onClick={openCalendar}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${FIELD_CONTROL_CLASSES} cursor-pointer pr-4`}
      />
    </FieldBox>
  )
}
