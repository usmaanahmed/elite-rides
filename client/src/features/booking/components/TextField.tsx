import type { LucideIcon } from 'lucide-react'
import type { ComponentProps } from 'react'
import { FIELD_CONTROL_CLASSES } from '../constants/fieldStyles'
import { FieldBox } from './FieldBox'

// Accepts every normal <input> prop, so React Hook Form's
// `{...register('fieldName')}` can be spread straight onto it.
type TextFieldProps = ComponentProps<'input'> & {
  id: string
  label: string
  icon: LucideIcon
  error?: string
}

// A text box in the booking card style (icon on the left, small label on top)
export function TextField({ id, label, icon, error, ...inputProps }: TextFieldProps) {
  return (
    <FieldBox label={label} htmlFor={id} icon={icon} error={error}>
      <input
        {...inputProps}
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${FIELD_CONTROL_CLASSES} pr-4`}
      />
    </FieldBox>
  )
}
