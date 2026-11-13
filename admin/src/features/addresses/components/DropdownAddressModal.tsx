import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Alert } from '../../../shared/components/feedback/Alert'
import { FormField } from '../../../shared/components/forms/FormField'
import { FormModalFooter } from '../../../shared/components/forms/FormModalFooter'
import { FormSection } from '../../../shared/components/forms/FormSection'
import { RadioGroup } from '../../../shared/components/inputs/RadioGroup'
import { TextInput } from '../../../shared/components/inputs/TextInput'
import { Modal } from '../../../shared/components/modals/Modal'
import { ADDRESS_TYPES } from '../constants/addressTypes'
import { useAddDropdownAddress, useEditDropdownAddress } from '../hooks/useDropdownAddresses'
import { dropdownAddressFormSchema } from '../schemas/dropdownAddressFormSchema'
import type { DropdownAddress, DropdownAddressFormValues, NewDropdownAddress } from '../types/dropdownAddress'

type DropdownAddressModalProps = {
  isOpen: boolean
  onClose: () => void
  // The address being edited. null means the modal adds a new address.
  addressToEdit: DropdownAddress | null
  // Called with the saved address after it has been added or updated
  onSaved: (address: DropdownAddress, wasEdit: boolean) => void
}

// Lets the footer's Save button (which sits outside the <form>) submit the form
const FORM_ID = 'dropdown-address-form'

const emptyFormValues: DropdownAddressFormValues = {
  address: '',
  comparableValue: '',
  pickupCharge: '',
  dropoffCharge: '',
  type: 'address',
}

// Turns a saved address into the text values the form works with
function toFormValues(address: DropdownAddress): DropdownAddressFormValues {
  return {
    address: address.address,
    comparableValue: address.comparableValue,
    pickupCharge: String(address.pickupCharge),
    dropoffCharge: String(address.dropoffCharge),
    type: address.type,
  }
}

// One modal for both adding a new drop down address and editing an existing one
export function DropdownAddressModal({ isOpen, onClose, addressToEdit, onSaved }: DropdownAddressModalProps) {
  // React Compiler can cache React Hook Form's changing formState (errors, isDirty) and show stale errors, so skip it here
  'use no memo'

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

  const addMutation = useAddDropdownAddress()
  const editMutation = useEditDropdownAddress()

  const isEditing = addressToEdit !== null

  // Every time the modal opens, fill the form with the address being edited (or empty for a new one)
  useEffect(() => {
    if (!isOpen) return
    if (addressToEdit) {
      reset(toFormValues(addressToEdit))
    } else {
      reset(emptyFormValues)
    }
  }, [isOpen, addressToEdit, reset])

  function handleClose() {
    // Don't allow closing halfway through saving
    if (isSubmitting) return
    onClose()
  }

  // Only runs once every field has passed validation
  async function saveAddress(values: DropdownAddressFormValues) {
    const addressData: NewDropdownAddress = {
      address: values.address,
      comparableValue: values.comparableValue,
      pickupCharge: Number(values.pickupCharge),
      dropoffCharge: Number(values.dropoffCharge),
      type: values.type,
    }

    try {
      let savedAddress: DropdownAddress
      if (addressToEdit) {
        savedAddress = await editMutation.mutateAsync({ addressId: addressToEdit.id, address: addressData })
      } else {
        savedAddress = await addMutation.mutateAsync(addressData)
      }
      onSaved(savedAddress, isEditing)
      onClose()
    } catch (error) {
      // Show the server's message (e.g. "comparable value is already used") when there is one
      let message = 'The address could not be saved. Please try again.'
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
      title={isEditing ? 'Edit address' : 'Add address'}
      description="An address customers can pick from the drop down when booking."
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
              hint="Used to match this address when customers search. Must be unique."
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
