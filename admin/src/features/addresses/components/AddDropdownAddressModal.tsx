import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Alert } from '../../../shared/components/feedback/Alert'
import { FormField } from '../../../shared/components/forms/FormField'
import { FormModalFooter } from '../../../shared/components/forms/FormModalFooter'
import { FormSection } from '../../../shared/components/forms/FormSection'
import { RadioGroup } from '../../../shared/components/inputs/RadioGroup'
import { TextInput } from '../../../shared/components/inputs/TextInput'
import { Modal } from '../../../shared/components/modals/Modal'
import { addDropdownAddress } from '../api/addDropdownAddress'
import { ADDRESS_TYPES } from '../constants/addressTypes'
import { dropdownAddressFormSchema } from '../schemas/dropdownAddressFormSchema'
import type { DropdownAddressFormValues, NewDropdownAddress } from '../types/dropdownAddress'

type AddDropdownAddressModalProps = {
  isOpen: boolean
  onClose: () => void
  // Called with the saved address after it has been added
  onAddressAdded: (address: NewDropdownAddress) => void
}

// Lets the footer's Save button (which sits outside the <form>) submit the form
const FORM_ID = 'add-dropdown-address-form'

const emptyFormValues: DropdownAddressFormValues = {
  address: '',
  comparableValue: '',
  pickupCharge: '',
  dropoffCharge: '',
  type: 'address',
}

export function AddDropdownAddressModal({ isOpen, onClose, onAddressAdded }: AddDropdownAddressModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<DropdownAddressFormValues>({
    resolver: zodResolver(dropdownAddressFormSchema),
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
  async function saveAddress(values: DropdownAddressFormValues) {
    const newAddress: NewDropdownAddress = {
      address: values.address,
      comparableValue: values.comparableValue,
      pickupCharge: Number(values.pickupCharge),
      dropoffCharge: Number(values.dropoffCharge),
      type: values.type,
    }

    try {
      await addDropdownAddress(newAddress)
      onAddressAdded(newAddress)
      reset()
      onClose()
    } catch {
      // 'root' is a form-wide error that isn't tied to one field
      setError('root', { message: 'The address could not be saved. Please try again.' })
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add address"
      description="Add an address customers can pick from the drop down when booking."
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
      <form id={FORM_ID} onSubmit={handleSubmit(saveAddress)} noValidate className="space-y-8">
        {errors.root?.message && <Alert variant="error" title={errors.root.message} />}

        <FormSection title="Location">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Address" htmlFor="address" error={errors.address?.message}>
              <TextInput
                id="address"
                placeholder="e.g. Heathrow Airport, TW6 1EW"
                autoComplete="off"
                {...register('address')}
                hasError={!!errors.address}
              />
            </FormField>

            <FormField
              label="Comparable value"
              htmlFor="comparableValue"
              hint="Used to match this address when customers search."
              error={errors.comparableValue?.message}
            >
              <TextInput
                id="comparableValue"
                placeholder="e.g. heathrow"
                autoComplete="off"
                {...register('comparableValue')}
                hasError={!!errors.comparableValue}
              />
            </FormField>

            <RadioGroup
              label="Type"
              options={ADDRESS_TYPES}
              error={errors.type?.message}
              className="sm:col-span-2"
              {...register('type')}
            />
          </div>
        </FormSection>

        <FormSection title="Charges" description="Added to the fare when a journey starts or ends here.">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Pickup charge" htmlFor="pickupCharge" error={errors.pickupCharge?.message}>
              <TextInput
                id="pickupCharge"
                inputMode="decimal"
                placeholder="0.00"
                prefix="£"
                {...register('pickupCharge')}
                hasError={!!errors.pickupCharge}
              />
            </FormField>

            <FormField label="Drop-off charge" htmlFor="dropoffCharge" error={errors.dropoffCharge?.message}>
              <TextInput
                id="dropoffCharge"
                inputMode="decimal"
                placeholder="0.00"
                prefix="£"
                {...register('dropoffCharge')}
                hasError={!!errors.dropoffCharge}
              />
            </FormField>
          </div>
        </FormSection>
      </form>
    </Modal>
  )
}
