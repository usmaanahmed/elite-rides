import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Alert } from '../../../shared/components/feedback/Alert'
import { FormField } from '../../../shared/components/forms/FormField'
import { FormModalFooter } from '../../../shared/components/forms/FormModalFooter'
import { SelectInput } from '../../../shared/components/inputs/SelectInput'
import { TextInput } from '../../../shared/components/inputs/TextInput'
import { Modal } from '../../../shared/components/modals/Modal'
import { AMOUNT_TYPE_OPTIONS, STATUS_OPTIONS } from '../constants/surchargeOptions'
import { useAddSurchargeDate, useEditSurchargeDate } from '../hooks/useSurchargeDates'
import { surchargeDateFormSchema } from '../schemas/surchargeDateFormSchema'
import type { NewSurchargeDate, SurchargeDate, SurchargeDateFormValues } from '../types/surchargeDate'

type SurchargeDateModalProps = {
  isOpen: boolean
  onClose: () => void
  // The surcharge being edited. null means the modal adds a new one.
  surchargeToEdit: SurchargeDate | null
  // Called with the saved surcharge after it has been added or updated
  onSaved: (surcharge: SurchargeDate, wasEdit: boolean) => void
}

// Lets the footer's Save button (which sits outside the <form>) submit the form
const FORM_ID = 'surcharge-date-form'

const emptyFormValues: SurchargeDateFormValues = {
  date: '',
  amountType: 'fixed',
  amount: '',
  fromTime: '',
  toTime: '',
  status: 'active',
}

// One modal for both adding a new date surcharge and editing an existing one
export function SurchargeDateModal({ isOpen, onClose, surchargeToEdit, onSaved }: SurchargeDateModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<SurchargeDateFormValues>({
    resolver: zodResolver(surchargeDateFormSchema),
    defaultValues: emptyFormValues,
    // Check a field once the user leaves it, then re-check it live as they fix it
    mode: 'onTouched',
  })

  const addMutation = useAddSurchargeDate()
  const editMutation = useEditSurchargeDate()

  const isEditing = surchargeToEdit !== null
  // The amount box shows £ or % in front, depending on the chosen type
  const amountType = watch('amountType')

  // Every time the modal opens, fill the form with the surcharge being edited (or empty for a new one)
  useEffect(() => {
    if (!isOpen) return
    if (surchargeToEdit) {
      reset({
        date: surchargeToEdit.date,
        amountType: surchargeToEdit.amountType,
        amount: String(surchargeToEdit.amount),
        fromTime: surchargeToEdit.fromTime,
        toTime: surchargeToEdit.toTime,
        status: surchargeToEdit.status,
      })
    } else {
      reset(emptyFormValues)
    }
  }, [isOpen, surchargeToEdit, reset])

  function handleClose() {
    // Don't allow closing halfway through saving
    if (isSubmitting) return
    onClose()
  }

  // Only runs once every field has passed validation
  async function saveSurchargeDate(values: SurchargeDateFormValues) {
    const surchargeData: NewSurchargeDate = {
      date: values.date,
      amountType: values.amountType,
      amount: Number(values.amount),
      fromTime: values.fromTime,
      toTime: values.toTime,
      status: values.status,
    }

    try {
      let savedSurcharge: SurchargeDate
      if (surchargeToEdit) {
        savedSurcharge = await editMutation.mutateAsync({ surchargeId: surchargeToEdit.id, surcharge: surchargeData })
      } else {
        savedSurcharge = await addMutation.mutateAsync(surchargeData)
      }
      onSaved(savedSurcharge, isEditing)
      onClose()
    } catch (error) {
      let message = 'The surcharge could not be saved. Please try again.'
      if (error instanceof Error && error.message) {
        message = error.message
      }
      // 'root' is a form-wide error that isn't tied to one field
      setError('root', { message })
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditing ? 'Edit date surcharge' : 'Add date surcharge'}
      description="Charge extra for bookings with a pickup on this date."
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

        <FormField label="Date" htmlFor="date" error={errors.date?.message}>
          <TextInput id="date" type="date" {...register('date')} hasError={!!errors.date} />
        </FormField>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Amount type" htmlFor="amountType" error={errors.amountType?.message}>
            <SelectInput
              id="amountType"
              options={AMOUNT_TYPE_OPTIONS}
              {...register('amountType')}
              hasError={!!errors.amountType}
            />
          </FormField>

          <FormField label="Amount" htmlFor="amount" error={errors.amount?.message}>
            <TextInput
              id="amount"
              inputMode="decimal"
              placeholder="0.00"
              prefix={amountType === 'fixed' ? '£' : undefined}
              suffix={amountType === 'percent' ? '%' : undefined}
              {...register('amount')}
              hasError={!!errors.amount}
            />
          </FormField>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="From time (optional)" htmlFor="fromTime" error={errors.fromTime?.message}>
            <TextInput id="fromTime" type="time" {...register('fromTime')} hasError={!!errors.fromTime} />
          </FormField>

          <FormField label="To time (optional)" htmlFor="toTime" error={errors.toTime?.message}>
            <TextInput id="toTime" type="time" {...register('toTime')} hasError={!!errors.toTime} />
          </FormField>
        </div>

        <FormField label="Status" htmlFor="status" error={errors.status?.message}>
          <SelectInput id="status" options={STATUS_OPTIONS} {...register('status')} hasError={!!errors.status} />
        </FormField>
      </form>
    </Modal>
  )
}
