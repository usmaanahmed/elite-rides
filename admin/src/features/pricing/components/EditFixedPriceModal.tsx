import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Alert } from '../../../shared/components/feedback/Alert'
import { FormField } from '../../../shared/components/forms/FormField'
import { FormModalFooter } from '../../../shared/components/forms/FormModalFooter'
import { SelectInput } from '../../../shared/components/inputs/SelectInput'
import { TextInput } from '../../../shared/components/inputs/TextInput'
import { Modal } from '../../../shared/components/modals/Modal'
import { useVehicles } from '../../vehicles/hooks/useVehicles'
import { useEditFixedPrice } from '../hooks/useFixedPrices'
import { editFixedPriceFormSchema } from '../schemas/fixedPriceFormSchema'
import type { EditFixedPriceFormValues, FixedPrice, FixedPriceUpdate } from '../types/fixedPrice'

type EditFixedPriceModalProps = {
  isOpen: boolean
  onClose: () => void
  fixedPrice: FixedPrice | null
  onSaved: (fixedPrice: FixedPrice) => void
}

// Lets the footer's Save button (which sits outside the <form>) submit the form
const FORM_ID = 'edit-fixed-price-form'

function toFormValues(fixedPrice: FixedPrice): EditFixedPriceFormValues {
  return {
    pickupPostcode: fixedPrice.pickupPostcode,
    dropCode: fixedPrice.dropCode,
    vehicleId: fixedPrice.vehicleId,
    amount: String(fixedPrice.fare),
  }
}

export function EditFixedPriceModal({ isOpen, onClose, fixedPrice, onSaved }: EditFixedPriceModalProps) {
  const vehiclesQuery = useVehicles()
  const vehicleOptions = (vehiclesQuery.data ?? []).map((vehicle) => ({ value: vehicle.id, label: vehicle.name }))

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<EditFixedPriceFormValues>({
    resolver: zodResolver(editFixedPriceFormSchema),
    defaultValues: fixedPrice ? toFormValues(fixedPrice) : undefined,
    mode: 'onTouched',
  })

  const editFixedPriceMutation = useEditFixedPrice()

  // Load the row's current values into the form whenever a different row is opened
  useEffect(() => {
    if (fixedPrice) reset(toFormValues(fixedPrice))
  }, [fixedPrice, reset])

  function handleClose() {
    if (isSubmitting) return
    onClose()
  }

  async function saveFixedPrice(values: EditFixedPriceFormValues) {
    if (!fixedPrice) return

    const update: FixedPriceUpdate = {
      pickupPostcode: values.pickupPostcode,
      dropCode: values.dropCode,
      vehicleId: values.vehicleId,
      fare: Number(values.amount),
    }

    try {
      const saved = await editFixedPriceMutation.mutateAsync({ fixedPriceId: fixedPrice.id, update })
      onSaved(saved)
      onClose()
    } catch (error) {
      let message = 'The fixed price could not be saved. Please try again.'
      if (error instanceof Error && error.message) {
        message = error.message
      }
      setError('root', { message })
    }
  }

  if (!fixedPrice) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit fixed price"
      size="small"
      footer={
        <FormModalFooter
          formId={FORM_ID}
          submitLabel="Save changes"
          isSubmitting={isSubmitting}
          canReset={isDirty}
          onReset={() => reset(toFormValues(fixedPrice))}
          onCancel={handleClose}
        />
      }
      closeOnBackdropClick={!isDirty}
    >
      <form id={FORM_ID} onSubmit={handleSubmit(saveFixedPrice)} noValidate className="space-y-5">
        {errors.root?.message && <Alert variant="error" title={errors.root.message} />}

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Pickup postcode" htmlFor="editPickupPostcode" error={errors.pickupPostcode?.message}>
            <TextInput
              id="editPickupPostcode"
              autoComplete="off"
              autoCapitalize="characters"
              {...register('pickupPostcode')}
              hasError={!!errors.pickupPostcode}
            />
          </FormField>

          <FormField label="Drop-off code" htmlFor="editDropCode" error={errors.dropCode?.message}>
            <TextInput id="editDropCode" autoComplete="off" {...register('dropCode')} hasError={!!errors.dropCode} />
          </FormField>
        </div>

        <FormField label="Vehicle" htmlFor="editVehicleId" error={errors.vehicleId?.message}>
          <SelectInput
            id="editVehicleId"
            placeholder="Select a vehicle"
            options={vehicleOptions}
            {...register('vehicleId')}
            hasError={!!errors.vehicleId}
          />
        </FormField>

        <FormField label="Fare" htmlFor="editAmount" error={errors.amount?.message}>
          <TextInput id="editAmount" inputMode="decimal" placeholder="0.00" prefix="£" {...register('amount')} hasError={!!errors.amount} />
        </FormField>
      </form>
    </Modal>
  )
}
