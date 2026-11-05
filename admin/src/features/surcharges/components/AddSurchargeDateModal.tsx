import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Alert } from '../../../shared/components/feedback/Alert'
import { FormField } from '../../../shared/components/forms/FormField'
import { FormModalFooter } from '../../../shared/components/forms/FormModalFooter'
import { TextInput } from '../../../shared/components/inputs/TextInput'
import { Modal } from '../../../shared/components/modals/Modal'
import { getTodayDateString } from '../../../shared/utils/getTodayDateString'
import { addSurchargeDate } from '../api/addSurchargeDate'
import { surchargeDateFormSchema } from '../schemas/surchargeDateFormSchema'
import type { NewSurchargeDate, SurchargeDateFormValues } from '../types/surchargeDate'

type AddSurchargeDateModalProps = {
  isOpen: boolean
  onClose: () => void
  // Called with the saved surcharge after it has been added
  onSurchargeDateAdded: (surchargeDate: NewSurchargeDate) => void
}

// Lets the footer's Save button (which sits outside the <form>) submit the form
const FORM_ID = 'add-surcharge-date-form'

const emptyFormValues: SurchargeDateFormValues = {
  surchargePercent: '',
  date: '',
  fromTime: '',
  toTime: '',
}

export function AddSurchargeDateModal({ isOpen, onClose, onSurchargeDateAdded }: AddSurchargeDateModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<SurchargeDateFormValues>({
    resolver: zodResolver(surchargeDateFormSchema),
    defaultValues: emptyFormValues,
    // Check a field once the user leaves it, then re-check it live as they fix it
    mode: 'onTouched',
  })

  function handleClose() {
    // Don't allow closing halfway through saving
    if (isSubmitting) return
    reset()
    onClose()
  }

  // Only runs once every field has passed validation
  async function saveSurchargeDate(values: SurchargeDateFormValues) {
    const newSurchargeDate: NewSurchargeDate = {
      surchargePercent: Number(values.surchargePercent),
      date: values.date,
      fromTime: values.fromTime,
      toTime: values.toTime,
    }

    try {
      await addSurchargeDate(newSurchargeDate)
      onSurchargeDateAdded(newSurchargeDate)
      reset()
      onClose()
    } catch {
      // 'root' is a form-wide error that isn't tied to one field
      setError('root', { message: 'The surcharge could not be saved. Please try again.' })
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add surcharge on date"
      description="Charge extra for bookings on this date between these times."
      size="small"
      footer={
        <FormModalFooter
          formId={FORM_ID}
          submitLabel="Save surcharge"
          isSubmitting={isSubmitting}
          canReset={isDirty}
          onReset={() => reset()}
          onCancel={handleClose}
        />
      }
      // A stray click outside shouldn't throw away a half-filled form
      closeOnBackdropClick={!isDirty}
    >
      {/* noValidate turns off the browser's own validation popups, so only our messages show */}
      <form id={FORM_ID} onSubmit={handleSubmit(saveSurchargeDate)} noValidate className="space-y-5">
        {errors.root?.message && <Alert variant="error" title={errors.root.message} />}

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Surcharge" htmlFor="surchargePercent" error={errors.surchargePercent?.message}>
            {/* inputMode brings up the number keypad on phones while keeping a plain text box */}
            <TextInput
              id="surchargePercent"
              inputMode="decimal"
              placeholder="0"
              suffix="%"
              {...register('surchargePercent')}
              hasError={!!errors.surchargePercent}
            />
          </FormField>

          <FormField label="Date" htmlFor="date" error={errors.date?.message}>
            {/* min greys out past days in the picker; the schema still checks typed-in dates */}
            <TextInput
              id="date"
              type="date"
              min={getTodayDateString()}
              {...register('date')}
              hasError={!!errors.date}
            />
          </FormField>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="From time" htmlFor="fromTime" error={errors.fromTime?.message}>
            <TextInput id="fromTime" type="time" {...register('fromTime')} hasError={!!errors.fromTime} />
          </FormField>

          <FormField label="To time" htmlFor="toTime" error={errors.toTime?.message}>
            <TextInput id="toTime" type="time" {...register('toTime')} hasError={!!errors.toTime} />
          </FormField>
        </div>
      </form>
    </Modal>
  )
}
