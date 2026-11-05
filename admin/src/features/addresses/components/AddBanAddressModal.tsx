import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Alert } from '../../../shared/components/feedback/Alert'
import { FormField } from '../../../shared/components/forms/FormField'
import { FormModalFooter } from '../../../shared/components/forms/FormModalFooter'
import { TextInput } from '../../../shared/components/inputs/TextInput'
import { Modal } from '../../../shared/components/modals/Modal'
import { addBanAddress } from '../api/addBanAddress'
import { ADDRESS_MAX_LENGTH, banAddressFormSchema } from '../schemas/banAddressFormSchema'
import type { BanAddressFormValues, NewBanAddress } from '../types/banAddress'

type AddBanAddressModalProps = {
  isOpen: boolean
  onClose: () => void
  // Called with the saved address after it has been banned
  onBanAddressAdded: (banAddress: NewBanAddress) => void
}

// Lets the footer's Save button (which sits outside the <form>) submit the form
const FORM_ID = 'add-ban-address-form'

const emptyFormValues: BanAddressFormValues = {
  address: '',
}

export function AddBanAddressModal({ isOpen, onClose, onBanAddressAdded }: AddBanAddressModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<BanAddressFormValues>({
    resolver: zodResolver(banAddressFormSchema),
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
  async function saveBanAddress(values: BanAddressFormValues) {
    const newBanAddress: NewBanAddress = { address: values.address }

    try {
      await addBanAddress(newBanAddress)
      onBanAddressAdded(newBanAddress)
      reset()
      onClose()
    } catch {
      // 'root' is a form-wide error that isn't tied to one field
      setError('root', { message: 'The address could not be banned. Please try again.' })
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add ban address"
      description="Customers won't be able to use this address for pickup or drop-off."
      size="small"
      footer={
        <FormModalFooter
          formId={FORM_ID}
          submitLabel="Ban address"
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
      <form id={FORM_ID} onSubmit={handleSubmit(saveBanAddress)} noValidate className="space-y-5">
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
      </form>
    </Modal>
  )
}
