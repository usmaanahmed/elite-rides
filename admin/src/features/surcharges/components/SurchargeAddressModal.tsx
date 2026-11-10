import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Alert } from '../../../shared/components/feedback/Alert'
import { FormField } from '../../../shared/components/forms/FormField'
import { FormModalFooter } from '../../../shared/components/forms/FormModalFooter'
import { SelectInput } from '../../../shared/components/inputs/SelectInput'
import { TextInput } from '../../../shared/components/inputs/TextInput'
import { Modal } from '../../../shared/components/modals/Modal'
import { STATUS_OPTIONS } from '../constants/surchargeOptions'
import { useAddSurchargeAddress, useEditSurchargeAddress } from '../hooks/useSurchargeAddresses'
import { ADDRESS_MAX_LENGTH, surchargeAddressFormSchema } from '../schemas/surchargeAddressFormSchema'
import type { NewSurchargeAddress, SurchargeAddress, SurchargeAddressFormValues } from '../types/surchargeAddress'

type SurchargeAddressModalProps = {
  isOpen: boolean
  onClose: () => void
  // The address being edited. null means the modal adds a new one.
  addressToEdit: SurchargeAddress | null
  // Called with the saved address after it has been added or updated
  onSaved: (address: SurchargeAddress, wasEdit: boolean) => void
}

// Lets the footer's Save button (which sits outside the <form>) submit the form
const FORM_ID = 'surcharge-address-form'

const emptyFormValues: SurchargeAddressFormValues = {
  address: '',
  fromTime: '',
  toTime: '',
  price: '',
  status: 'active',
}

// One modal for both adding a new surcharge address and editing an existing one
export function SurchargeAddressModal({ isOpen, onClose, addressToEdit, onSaved }: SurchargeAddressModalProps) {
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

  const addMutation = useAddSurchargeAddress()
  const editMutation = useEditSurchargeAddress()

  const isEditing = addressToEdit !== null

  // Every time the modal opens, fill the form with the address being edited (or empty for a new one)
  useEffect(() => {
    if (!isOpen) return
    if (addressToEdit) {
      reset({
        address: addressToEdit.address,
        fromTime: addressToEdit.fromTime,
        toTime: addressToEdit.toTime,
        price: String(addressToEdit.price),
        status: addressToEdit.status,
      })
    } else {
      reset(emptyFormValues)
    }
  }, [isOpen, addressToEdit, reset])

  function handleClose() {
    // Don't allow closing halfway through saving
    if (isSubmitting) return
    onClose()
  }

  // Only runs once every field has passed validation (the schema has already trimmed the address)
  async function saveSurchargeAddress(values: SurchargeAddressFormValues) {
    const addressData: NewSurchargeAddress = {
      address: values.address,
      fromTime: values.fromTime,
      toTime: values.toTime,
      price: Number(values.price),
      status: values.status,
    }

    try {
      let savedAddress: SurchargeAddress
      if (addressToEdit) {
        savedAddress = await editMutation.mutateAsync({ addressId: addressToEdit.id, address: addressData })
      } else {
        savedAddress = await addMutation.mutateAsync(addressData)
      }
      onSaved(savedAddress, isEditing)
      onClose()
    } catch (error) {
      let message = 'The surcharge address could not be saved. Please try again.'
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
      title={isEditing ? 'Edit surcharge address' : 'Add surcharge address'}
      description="Charge extra for pickups or drop-offs at this address, when the pickup time is inside the window."
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

        <FormField
          label="Address"
          htmlFor="address"
          hint="Applies when the pickup or drop-off address contains this text, e.g. Heathrow."
          error={errors.address?.message}
        >
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

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Surcharge price" htmlFor="price" error={errors.price?.message}>
            <TextInput
              id="price"
              inputMode="decimal"
              placeholder="0.00"
              prefix="£"
              {...register('price')}
              hasError={!!errors.price}
            />
          </FormField>

          <FormField label="Status" htmlFor="status" error={errors.status?.message}>
            <SelectInput id="status" options={STATUS_OPTIONS} {...register('status')} hasError={!!errors.status} />
          </FormField>
        </div>
      </form>
    </Modal>
  )
}
