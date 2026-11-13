import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Alert } from '../../../shared/components/feedback/Alert'
import { FormField } from '../../../shared/components/forms/FormField'
import { FormModalFooter } from '../../../shared/components/forms/FormModalFooter'
import { TextInput } from '../../../shared/components/inputs/TextInput'
import { Modal } from '../../../shared/components/modals/Modal'
import { useAddCongestionAddress, useEditCongestionAddress } from '../hooks/useCongestionAddresses'
import { congestionAddressFormSchema } from '../schemas/congestionAddressFormSchema'
import type { CongestionAddress, CongestionAddressFormValues, NewCongestionAddress } from '../types/congestionAddress'

type CongestionAddressModalProps = {
  isOpen: boolean
  onClose: () => void
  // The address being edited. null means the modal adds a new one.
  addressToEdit: CongestionAddress | null
  // Called with the saved address after it has been added or updated
  onSaved: (address: CongestionAddress, wasEdit: boolean) => void
}

// Lets the footer's Save button (which sits outside the <form>) submit the form
const FORM_ID = 'congestion-address-form'

const emptyFormValues: CongestionAddressFormValues = {
  postcode: '',
  price: '',
}

// One modal for both adding a new congestion address and editing an existing one
export function CongestionAddressModal({ isOpen, onClose, addressToEdit, onSaved }: CongestionAddressModalProps) {
  // React Compiler can cache React Hook Form's changing formState (errors, isDirty) and show stale errors, so skip it here
  'use no memo'

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<CongestionAddressFormValues>({
    resolver: zodResolver(congestionAddressFormSchema),
    defaultValues: emptyFormValues,
    // Check a field once the user leaves it, then re-check it live as they fix it
    mode: 'onTouched',
  })

  const addMutation = useAddCongestionAddress()
  const editMutation = useEditCongestionAddress()

  const isEditing = addressToEdit !== null

  // Every time the modal opens, fill the form with the address being edited (or empty for a new one)
  useEffect(() => {
    if (!isOpen) return
    if (addressToEdit) {
      reset({ postcode: addressToEdit.postcode, price: String(addressToEdit.price) })
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
  async function saveAddress(values: CongestionAddressFormValues) {
    const addressData: NewCongestionAddress = {
      postcode: values.postcode,
      price: Number(values.price),
    }

    try {
      let savedAddress: CongestionAddress
      if (addressToEdit) {
        savedAddress = await editMutation.mutateAsync({ addressId: addressToEdit.id, address: addressData })
      } else {
        savedAddress = await addMutation.mutateAsync(addressData)
      }
      onSaved(savedAddress, isEditing)
      onClose()
    } catch (error) {
      // Show the server's message (e.g. "postcode already has a charge") when there is one
      let message = 'The congestion address could not be saved. Please try again.'
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
      title={isEditing ? 'Edit congestion address' : 'Add congestion address'}
      description="Added to the fare when a journey starts, passes or ends in this postcode area."
      size="small"
      footer={
        <FormModalFooter
          formId={FORM_ID}
          submitLabel="Save"
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
      <form id={FORM_ID} onSubmit={handleSubmit(saveAddress)} noValidate className="space-y-5">
        {errors.root?.message && <Alert variant="error" title={errors.root.message} />}

        <FormField
          label="Postcode"
          htmlFor="postcode"
          hint="The start of the postcode, e.g. EC1 or WC2."
          error={errors.postcode?.message}
        >
          <TextInput
            id="postcode"
            placeholder="e.g. EC1"
            autoComplete="off"
            {...register('postcode')}
            hasError={!!errors.postcode}
          />
        </FormField>

        <FormField label="Congestion charge" htmlFor="price" error={errors.price?.message}>
          <TextInput
            id="price"
            inputMode="decimal"
            placeholder="0.00"
            prefix="£"
            {...register('price')}
            hasError={!!errors.price}
          />
        </FormField>
      </form>
    </Modal>
  )
}
