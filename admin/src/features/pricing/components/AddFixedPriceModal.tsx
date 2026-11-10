import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderCircle } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Alert } from '../../../shared/components/feedback/Alert'
import { FormField } from '../../../shared/components/forms/FormField'
import { FormModalFooter } from '../../../shared/components/forms/FormModalFooter'
import { FormSection } from '../../../shared/components/forms/FormSection'
import { TextInput } from '../../../shared/components/inputs/TextInput'
import { Modal } from '../../../shared/components/modals/Modal'
import { useVehicles } from '../../vehicles/hooks/useVehicles'
import type { Vehicle } from '../../vehicles/types/vehicle'
import { useAddFixedPrices } from '../hooks/useFixedPrices'
import { fixedPriceFormSchema } from '../schemas/fixedPriceFormSchema'
import type { FixedPrice, FixedPriceFormValues, NewFixedPrice } from '../types/fixedPrice'

type AddFixedPriceModalProps = {
  isOpen: boolean
  onClose: () => void
  // Called with the saved rows after they have been added
  onFixedPriceAdded: (fixedPrices: FixedPrice[]) => void
}

// Lets the footer's Save button (which sits outside the <form>) submit the form
const FORM_ID = 'add-fixed-price-form'

function emptyFormValues(vehicles: Vehicle[]): FixedPriceFormValues {
  return {
    pickupPostcode: '',
    dropCode: '',
    // One empty price box per vehicle
    prices: vehicles.map((vehicle) => ({ vehicleId: vehicle.id, amount: '' })),
  }
}

export function AddFixedPriceModal({ isOpen, onClose, onFixedPriceAdded }: AddFixedPriceModalProps) {
  // The vehicles list from the server, so one price box is shown per real vehicle
  const vehiclesQuery = useVehicles()
  const vehicles = vehiclesQuery.data ?? []

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FixedPriceFormValues>({
    resolver: zodResolver(fixedPriceFormSchema),
    defaultValues: emptyFormValues(vehicles),
    // Check a field once the user leaves it, then re-check it live as they fix it
    mode: 'onTouched',
  })

  const addFixedPricesMutation = useAddFixedPrices()

  // The vehicles list loads after the form is first created, so fill in its price boxes once it arrives
  useEffect(() => {
    if (vehiclesQuery.data) reset(emptyFormValues(vehiclesQuery.data))
  }, [vehiclesQuery.data, reset])

  function handleClose() {
    // Don't allow closing halfway through saving
    if (isSubmitting) return
    reset(emptyFormValues(vehicles))
    onClose()
  }

  // Only runs once every field has passed validation (the postcode arrives already tidied, e.g. "LU1 3QF")
  async function saveFixedPrice(values: FixedPriceFormValues) {
    const newFixedPrice: NewFixedPrice = {
      pickupPostcode: values.pickupPostcode,
      dropCode: values.dropCode,
      // Blank boxes mean "not offered on this route", so they are left out
      prices: values.prices
        .filter((price) => price.amount !== '')
        .map((price) => ({ vehicleId: price.vehicleId, fare: Number(price.amount) })),
    }

    try {
      const saved = await addFixedPricesMutation.mutateAsync(newFixedPrice)
      onFixedPriceAdded(saved)
      reset(emptyFormValues(vehicles))
      onClose()
    } catch (error) {
      // Show the server's message (e.g. a duplicate route) when there is one
      let message = 'The fixed price could not be saved. Please try again.'
      if (error instanceof Error && error.message) {
        message = error.message
      }
      // 'root' is a form-wide error that isn't tied to one field
      setError('root', { message })
    }
  }

  // The "at least one price" error belongs to the whole list of prices, not one box
  const noPricesError = errors.prices?.root?.message

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add fixed price"
      description="Set a fixed fare between a pickup postcode and a drop-off keyword. It replaces the mileage rate for this journey."
      footer={
        <FormModalFooter
          formId={FORM_ID}
          submitLabel="Save fixed price"
          isSubmitting={isSubmitting}
          canReset={isDirty}
          onReset={() => reset(emptyFormValues(vehicles))}
          onCancel={handleClose}
        />
      }
      // A stray click outside shouldn't throw away a half-filled form
      closeOnBackdropClick={!isDirty}
    >
      {vehiclesQuery.isPending ? (
        <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted">
          <LoaderCircle className="size-4 animate-spin" strokeWidth={2} />
          Loading vehicles…
        </div>
      ) : vehiclesQuery.isError ? (
        <Alert variant="error" title="Vehicles could not be loaded" description={vehiclesQuery.error.message} />
      ) : (
        /* noValidate turns off the browser's own validation popups, so only our messages show */
        <form id={FORM_ID} onSubmit={handleSubmit(saveFixedPrice)} noValidate className="space-y-8">
          {errors.root?.message && <Alert variant="error" title={errors.root.message} />}

          <FormSection title="Route">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                label="Pickup postcode"
                htmlFor="pickupPostcode"
                hint="Full postcode (LU1 3QF) or an area (LU1)."
                error={errors.pickupPostcode?.message}
              >
                <TextInput
                  id="pickupPostcode"
                  placeholder="e.g. LU1 3QF"
                  autoComplete="off"
                  autoCapitalize="characters"
                  {...register('pickupPostcode')}
                  hasError={!!errors.pickupPostcode}
                />
              </FormField>

              <FormField
                label="Drop-off code"
                htmlFor="dropCode"
                hint="A keyword matched inside the drop-off address, e.g. heathrow."
                error={errors.dropCode?.message}
              >
                <TextInput
                  id="dropCode"
                  placeholder="e.g. heathrow"
                  autoComplete="off"
                  {...register('dropCode')}
                  hasError={!!errors.dropCode}
                />
              </FormField>
            </div>
          </FormSection>

          <FormSection title="Prices" description="Leave a vehicle blank if it isn't offered on this route.">
            {noPricesError && <Alert variant="error" title={noPricesError} className="mb-4" />}

            {vehicles.length === 0 ? (
              <p className="text-sm text-muted">Add a vehicle first on the Vehicles & Mileage Setting page.</p>
            ) : (
              /* One price box per vehicle. `index` ties each box to its entry in the `prices` list. */
              <div className="grid gap-4 sm:grid-cols-2">
                {vehicles.map((vehicle, index) => {
                  const inputId = `price-${vehicle.id}`
                  const priceError = errors.prices?.[index]?.amount?.message

                  return (
                    <FormField key={vehicle.id} label={vehicle.name} htmlFor={inputId} error={priceError}>
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
            )}
          </FormSection>
        </form>
      )}
    </Modal>
  )
}
