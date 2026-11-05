import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Alert } from '../../../shared/components/feedback/Alert'
import { FormField } from '../../../shared/components/forms/FormField'
import { FormModalFooter } from '../../../shared/components/forms/FormModalFooter'
import { FormSection } from '../../../shared/components/forms/FormSection'
import { TextInput } from '../../../shared/components/inputs/TextInput'
import { Modal } from '../../../shared/components/modals/Modal'
import { VEHICLE_TYPES } from '../../vehicles/constants/vehicleTypes'
import { addFixedPrice } from '../api/addFixedPrice'
import { fixedPriceFormSchema } from '../schemas/fixedPriceFormSchema'
import type { FixedPriceFormValues, NewFixedPrice } from '../types/fixedPrice'

type AddFixedPriceModalProps = {
  isOpen: boolean
  onClose: () => void
  // Called with the saved route after it has been added
  onFixedPriceAdded: (fixedPrice: NewFixedPrice) => void
}

// Lets the footer's Save button (which sits outside the <form>) submit the form
const FORM_ID = 'add-fixed-price-form'

// One empty price box per vehicle type
const emptyFormValues: FixedPriceFormValues = {
  pickupPostcode: '',
  dropoffPostcode: '',
  prices: VEHICLE_TYPES.map((vehicleType) => ({ vehicleTypeId: vehicleType.id, amount: '' })),
}

export function AddFixedPriceModal({ isOpen, onClose, onFixedPriceAdded }: AddFixedPriceModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FixedPriceFormValues>({
    resolver: zodResolver(fixedPriceFormSchema),
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

  // Only runs once every field has passed validation (postcodes arrive already tidied, e.g. "LU1 3QF")
  async function saveFixedPrice(values: FixedPriceFormValues) {
    const newFixedPrice: NewFixedPrice = {
      pickupPostcode: values.pickupPostcode,
      dropoffPostcode: values.dropoffPostcode,
      // Blank boxes mean "not offered on this route", so they are left out
      prices: values.prices
        .filter((price) => price.amount !== '')
        .map((price) => ({ vehicleTypeId: price.vehicleTypeId, amount: Number(price.amount) })),
    }

    try {
      await addFixedPrice(newFixedPrice)
      onFixedPriceAdded(newFixedPrice)
      reset()
      onClose()
    } catch {
      // 'root' is a form-wide error that isn't tied to one field
      setError('root', { message: 'The fixed price could not be saved. Please try again.' })
    }
  }

  // The "at least one price" error belongs to the whole list of prices, not one box
  const noPricesError = errors.prices?.root?.message

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add fixed price"
      description="Set a fixed fare between two postcodes. It replaces the mileage rate for this journey."
      footer={
        <FormModalFooter
          formId={FORM_ID}
          submitLabel="Save fixed price"
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
      <form id={FORM_ID} onSubmit={handleSubmit(saveFixedPrice)} noValidate className="space-y-8">
        {errors.root?.message && <Alert variant="error" title={errors.root.message} />}

        <FormSection title="Route" description="Use a full postcode (LU1 3QF) or a postcode area (LU1).">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Pickup postcode" htmlFor="pickupPostcode" error={errors.pickupPostcode?.message}>
              <TextInput
                id="pickupPostcode"
                placeholder="e.g. LU1 3QF"
                autoComplete="off"
                autoCapitalize="characters"
                {...register('pickupPostcode')}
                hasError={!!errors.pickupPostcode}
              />
            </FormField>

            <FormField label="Drop-off postcode" htmlFor="dropoffPostcode" error={errors.dropoffPostcode?.message}>
              <TextInput
                id="dropoffPostcode"
                placeholder="e.g. TW6 1EW"
                autoComplete="off"
                autoCapitalize="characters"
                {...register('dropoffPostcode')}
                hasError={!!errors.dropoffPostcode}
              />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Prices" description="Leave a vehicle blank if it isn't offered on this route.">
          {noPricesError && <Alert variant="error" title={noPricesError} className="mb-4" />}

          {/* One price box per vehicle type. `index` ties each box to its entry in the `prices` list. */}
          <div className="grid gap-4 sm:grid-cols-2">
            {VEHICLE_TYPES.map((vehicleType, index) => {
              const inputId = `price-${vehicleType.id}`
              const priceError = errors.prices?.[index]?.amount?.message

              return (
                <FormField key={vehicleType.id} label={vehicleType.name} htmlFor={inputId} error={priceError}>
                  <TextInput
                    id={inputId}
                    inputMode="decimal"
                    placeholder="0.00"
                    prefix="£"
                    {...register(`prices.${index}.amount`)}
                    hasError={!!priceError}
                  />
                </FormField>
              )
            })}
          </div>
        </FormSection>
      </form>
    </Modal>
  )
}
