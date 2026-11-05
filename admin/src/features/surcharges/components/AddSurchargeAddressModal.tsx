import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Alert } from '../../../shared/components/feedback/Alert'
import { FormField } from '../../../shared/components/forms/FormField'
import { FormModalFooter } from '../../../shared/components/forms/FormModalFooter'
import { TextInput } from '../../../shared/components/inputs/TextInput'
import { Modal } from '../../../shared/components/modals/Modal'
import { addSurchargeAddress } from '../api/addSurchargeAddress'
import { ADDRESS_MAX_LENGTH, surchargeAddressFormSchema } from '../schemas/surchargeAddressFormSchema'
import type { NewSurchargeAddress, SurchargeAddressFormValues } from '../types/surchargeAddress'

type AddSurchargeAddressModalProps = {
  isOpen: boolean
  onClose: () => void
  // Called with the saved address after it has been added
  onSurchargeAddressAdded: (surchargeAddress: NewSurchargeAddress) => void
}

// Lets the footer's Save button (which sits outside the <form>) submit the form
const FORM_ID = 'add-surcharge-address-form'

const emptyFormValues: SurchargeAddressFormValues = {
  address: '',
  fromTime: '',
  toTime: '',
}

export function AddSurchargeAddressModal({ isOpen, onClose, onSurchargeAddressAdded }: AddSurchargeAddressModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<SurchargeAddressFormValues>({
    resolver: zodResolver(surchargeAddressFormSchema),
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

  // Only runs once every field has passed validation (the schema has already trimmed the address)
  async function saveSurchargeAddress(values: SurchargeAddressFormValues) {
    const newSurchargeAddress: NewSurchargeAddress = {
      address: values.address,
      fromTime: values.fromTime,
      toTime: values.toTime,
    }

    try {
      await addSurchargeAddress(newSurchargeAddress)
      onSurchargeAddressAdded(newSurchargeAddress)
      reset()
      onClose()
    } catch {
      // 'root' is a form-wide error that isn't tied to one field
      setError('root', { message: 'The surcharge address could not be saved. Please try again.' })
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add surcharge address"
      description="Charge extra for pickups or drop-offs at this address between these times."
      size="small"
      footer={
        <FormModalFooter
          formId={FORM_ID}
          submitLabel="Save address"
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
      <form id={FORM_ID} onSubmit={handleSubmit(saveSurchargeAddress)} noValidate className="space-y-5">
        {errors.root?.message && <Alert variant="error" title={errors.root.message} />}

        <FormField label="Address" htmlFor="address" error={errors.address?.message}>
          <TextInput
            id="address"
            placeholder="Enter address"
            autoComplete="off"
            maxLength={ADDRESS_MAX_LENGTH}
            {...register('address')}
            hasError={!!errors.address}
          />
        </FormField>

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
