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
import { useAddSurchargeNight, useEditSurchargeNight } from '../hooks/useSurchargeNight'
import { surchargeNightFormSchema } from '../schemas/surchargeNightFormSchema'
import type { NewSurchargeNight, SurchargeNight, SurchargeNightFormValues } from '../types/surchargeNight'

type SurchargeNightModalProps = {
  isOpen: boolean
  onClose: () => void
  // The surcharge being edited. null means the modal adds a new one.
  surchargeToEdit: SurchargeNight | null
  // Called with the saved surcharge after it has been added or updated
  onSaved: (surcharge: SurchargeNight, wasEdit: boolean) => void
}

// Lets the footer's Save button (which sits outside the <form>) submit the form
const FORM_ID = 'surcharge-night-form'

const emptyFormValues: SurchargeNightFormValues = {
  startTime: '22:00',
  endTime: '06:00',
  amountType: 'fixed',
  amount: '',
  status: 'active',
}

// One modal for both adding a new night surcharge and editing an existing one
export function SurchargeNightModal({ isOpen, onClose, surchargeToEdit, onSaved }: SurchargeNightModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<SurchargeNightFormValues>({
    resolver: zodResolver(surchargeNightFormSchema),
    defaultValues: emptyFormValues,
    mode: 'onTouched',
  })

  const addMutation = useAddSurchargeNight()
  const editMutation = useEditSurchargeNight()

  const isEditing = surchargeToEdit !== null
  // The amount box shows £ or % in front, depending on the chosen type
  const amountType = watch('amountType')

  // Every time the modal opens, fill the form with the surcharge being edited (or defaults for a new one)
  useEffect(() => {
    if (!isOpen) return
    if (surchargeToEdit) {
      reset({
        startTime: surchargeToEdit.startTime,
        endTime: surchargeToEdit.endTime,
        amountType: surchargeToEdit.amountType,
        amount: String(surchargeToEdit.amount),
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
  async function saveSurchargeNight(values: SurchargeNightFormValues) {
    const surchargeData: NewSurchargeNight = {
      startTime: values.startTime,
      endTime: values.endTime,
      amountType: values.amountType,
      amount: Number(values.amount),
      status: values.status,
    }

    try {
      let savedSurcharge: SurchargeNight
      if (surchargeToEdit) {
        savedSurcharge = await editMutation.mutateAsync({ surchargeId: surchargeToEdit.id, surcharge: surchargeData })
      } else {
        savedSurcharge = await addMutation.mutateAsync(surchargeData)
      }
      onSaved(savedSurcharge, isEditing)
      onClose()
    } catch (error) {
      let message = 'The night surcharge could not be saved. Please try again.'
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
      title={isEditing ? 'Edit night surcharge' : 'Add night surcharge'}
      description="Charge extra for bookings whose pickup time falls in this window."
      size="small"
      footer={
        <FormModalFooter
          formId={FORM_ID}
          submitLabel="Save night surcharge"
          isSubmitting={isSubmitting}
          canReset={isDirty}
          onReset={() => reset()}
          onCancel={handleClose}
        />
      }
      closeOnBackdropClick={!isDirty}
    >
      {/* noValidate turns off the browser's own validation popups, so only our messages show */}
      <form id={FORM_ID} onSubmit={handleSubmit(saveSurchargeNight)} noValidate className="space-y-5">
        {errors.root?.message && <Alert variant="error" title={errors.root.message} />}

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Start time" htmlFor="startTime" error={errors.startTime?.message}>
            <TextInput id="startTime" type="time" {...register('startTime')} hasError={!!errors.startTime} />
          </FormField>

          <FormField
            label="End time"
            htmlFor="endTime"
            hint="Can be earlier than the start time, e.g. 22:00 to 06:00."
            error={errors.endTime?.message}
          >
            <TextInput id="endTime" type="time" {...register('endTime')} hasError={!!errors.endTime} />
          </FormField>
        </div>

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

        <FormField
          label="Status"
          htmlFor="status"
          hint="Inactive means this night surcharge is never added to a fare."
          error={errors.status?.message}
        >
          <SelectInput id="status" options={STATUS_OPTIONS} {...register('status')} hasError={!!errors.status} />
        </FormField>
      </form>
    </Modal>
  )
}
