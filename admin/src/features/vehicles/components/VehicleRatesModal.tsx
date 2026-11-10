import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash2 } from 'lucide-react'
import { useEffect } from 'react'
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form'
import { Alert } from '../../../shared/components/feedback/Alert'
import { Button } from '../../../shared/components/buttons/Button'
import { FormField } from '../../../shared/components/forms/FormField'
import { FormModalFooter } from '../../../shared/components/forms/FormModalFooter'
import { FormSection } from '../../../shared/components/forms/FormSection'
import { SegmentedControl } from '../../../shared/components/inputs/SegmentedControl'
import { TextInput } from '../../../shared/components/inputs/TextInput'
import { Modal } from '../../../shared/components/modals/Modal'
import { useUpdateVehicleRates } from '../hooks/useUpdateVehicleRates'
import { vehicleRatesFormSchema } from '../schemas/vehicleRatesFormSchema'
import type { Vehicle, VehicleRates, VehicleRatesFormValues } from '../types/vehicle'

type VehicleRatesModalProps = {
  isOpen: boolean
  onClose: () => void
  vehicle: Vehicle | null
  onRatesSaved: (vehicle: Vehicle) => void
}

// Lets the footer's Save button (which sits outside the <form>) submit the form
const FORM_ID = 'vehicle-rates-form'

const rateTypeOptions = [
  { value: 'mileage', label: 'Mileage bands' },
  { value: 'slab', label: 'Slab bands' },
]

function toFormValues(vehicle: Vehicle): VehicleRatesFormValues {
  return {
    rateType: vehicle.rateType,
    fixedPrice: String(vehicle.fixedPrice),
    hourlyRate: String(vehicle.hourlyRate),
    mileageBands:
      vehicle.mileageBands.length > 0
        ? vehicle.mileageBands.map((band) => ({
            fromMiles: String(band.fromMiles),
            toMiles: String(band.toMiles),
            ratePerMile: String(band.ratePerMile),
          }))
        : [{ fromMiles: '1', toMiles: '', ratePerMile: '' }],
    slabBands:
      vehicle.slabBands.length > 0
        ? vehicle.slabBands.map((band) => ({
            fromMiles: String(band.fromMiles),
            toMiles: String(band.toMiles),
            price: String(band.price),
          }))
        : [{ fromMiles: '1', toMiles: '', price: '' }],
  }
}

export function VehicleRatesModal({ isOpen, onClose, vehicle, onRatesSaved }: VehicleRatesModalProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    getValues,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<VehicleRatesFormValues>({
    resolver: zodResolver(vehicleRatesFormSchema),
    defaultValues: vehicle ? toFormValues(vehicle) : undefined,
    mode: 'onTouched',
  })

  const updateRatesMutation = useUpdateVehicleRates()
  // Read live (not just at submit time) so the form switches between mileage/slab bands as it's picked
  const rateType = useWatch({ control, name: 'rateType' })

  const mileageBandsArray = useFieldArray({ control, name: 'mileageBands' })
  const slabBandsArray = useFieldArray({ control, name: 'slabBands' })

  // Load the vehicle's current rates into the form whenever a different vehicle is opened
  useEffect(() => {
    if (vehicle) reset(toFormValues(vehicle))
  }, [vehicle, reset])

  function handleClose() {
    if (isSubmitting) return
    onClose()
  }

  // The next band's "from" picks up where the last one's "to" left off, so bands stay continuous
  function addMileageBand() {
    const lastIndex = mileageBandsArray.fields.length - 1
    const lastToMiles = lastIndex >= 0 ? getValues(`mileageBands.${lastIndex}.toMiles`) : ''
    mileageBandsArray.append({ fromMiles: lastToMiles || '', toMiles: '', ratePerMile: '' })
  }

  function addSlabBand() {
    const lastIndex = slabBandsArray.fields.length - 1
    const lastToMiles = lastIndex >= 0 ? getValues(`slabBands.${lastIndex}.toMiles`) : ''
    slabBandsArray.append({ fromMiles: lastToMiles || '', toMiles: '', price: '' })
  }

  async function saveRates(values: VehicleRatesFormValues) {
    if (!vehicle) return

    const rates: VehicleRates = {
      rateType: values.rateType,
      fixedPrice: Number(values.fixedPrice),
      hourlyRate: Number(values.hourlyRate),
      mileageBands: values.mileageBands.map((band) => ({
        fromMiles: Number(band.fromMiles),
        toMiles: Number(band.toMiles),
        ratePerMile: Number(band.ratePerMile),
      })),
      slabBands: values.slabBands.map((band) => ({
        fromMiles: Number(band.fromMiles),
        toMiles: Number(band.toMiles),
        price: Number(band.price),
      })),
    }

    try {
      const savedVehicle = await updateRatesMutation.mutateAsync({ vehicleId: vehicle.id, rates })
      onRatesSaved(savedVehicle)
      onClose()
    } catch (error) {
      let message = 'The rates could not be saved. Please try again.'
      if (error instanceof Error && error.message) {
        message = error.message
      }
      setError('root', { message })
    }
  }

  if (!vehicle) return null

  const mileageBandsError = errors.mileageBands?.root?.message ?? (typeof errors.mileageBands?.message === 'string' ? errors.mileageBands.message : undefined)
  const slabBandsError = errors.slabBands?.root?.message ?? (typeof errors.slabBands?.message === 'string' ? errors.slabBands.message : undefined)

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="£ Rates"
      description={`Set how ${vehicle.name}'s distance fare is calculated.`}
      footer={
        <FormModalFooter
          formId={FORM_ID}
          submitLabel="Save rates"
          isSubmitting={isSubmitting}
          canReset={isDirty}
          onReset={() => reset(toFormValues(vehicle))}
          onCancel={handleClose}
        />
      }
      closeOnBackdropClick={!isDirty}
    >
      <form id={FORM_ID} onSubmit={handleSubmit(saveRates)} noValidate className="space-y-8">
        {errors.root?.message && <Alert variant="error" title={errors.root.message} />}

        <FormSection title="Base pricing">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Fixed price" htmlFor="fixedPrice" hint="Added on top of the distance fare." error={errors.fixedPrice?.message}>
              <TextInput id="fixedPrice" inputMode="decimal" placeholder="0.00" prefix="£" {...register('fixedPrice')} hasError={!!errors.fixedPrice} />
            </FormField>

            <FormField label="Hourly rate" htmlFor="hourlyRate" hint="£0.00 turns off hourly hire for this vehicle." error={errors.hourlyRate?.message}>
              <TextInput id="hourlyRate" inputMode="decimal" placeholder="0.00" prefix="£" suffix="per hour" {...register('hourlyRate')} hasError={!!errors.hourlyRate} />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Distance fare" description="Charge per mile across bands, or a flat price per range.">
          <Controller
            name="rateType"
            control={control}
            render={({ field }) => (
              <SegmentedControl label="Rate type" options={rateTypeOptions} value={field.value} onChange={field.onChange} className="w-full" />
            )}
          />

          {rateType === 'mileage' ? (
            <div className="mt-4 space-y-3">
              {mileageBandsError && <Alert variant="error" title={mileageBandsError} />}

              {mileageBandsArray.fields.map((field, index) => (
                <div key={field.id} className="flex items-end gap-2.5 rounded-xl border border-line p-3">
                  <FormField label="From" htmlFor={`mileageFrom${index}`} error={errors.mileageBands?.[index]?.fromMiles?.message} className="w-20">
                    <TextInput id={`mileageFrom${index}`} inputMode="numeric" suffix="mi" {...register(`mileageBands.${index}.fromMiles`)} hasError={!!errors.mileageBands?.[index]?.fromMiles} />
                  </FormField>
                  <FormField label="To" htmlFor={`mileageTo${index}`} error={errors.mileageBands?.[index]?.toMiles?.message} className="w-20">
                    <TextInput id={`mileageTo${index}`} inputMode="numeric" suffix="mi" {...register(`mileageBands.${index}.toMiles`)} hasError={!!errors.mileageBands?.[index]?.toMiles} />
                  </FormField>
                  <FormField label="Rate per mile" htmlFor={`mileageRate${index}`} error={errors.mileageBands?.[index]?.ratePerMile?.message} className="flex-1">
                    <TextInput id={`mileageRate${index}`} inputMode="decimal" prefix="£" {...register(`mileageBands.${index}.ratePerMile`)} hasError={!!errors.mileageBands?.[index]?.ratePerMile} />
                  </FormField>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => mileageBandsArray.remove(index)}
                    disabled={mileageBandsArray.fields.length === 1}
                    className="mb-0.5 text-danger hover:bg-danger-soft"
                  >
                    <Trash2 className="size-4" strokeWidth={2} />
                  </Button>
                </div>
              ))}

              <Button type="button" variant="secondary" icon={Plus} onClick={addMileageBand}>
                Add item
              </Button>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {slabBandsError && <Alert variant="error" title={slabBandsError} />}

              {slabBandsArray.fields.map((field, index) => (
                <div key={field.id} className="flex items-end gap-2.5 rounded-xl border border-line p-3">
                  <FormField label="From" htmlFor={`slabFrom${index}`} error={errors.slabBands?.[index]?.fromMiles?.message} className="w-20">
                    <TextInput id={`slabFrom${index}`} inputMode="numeric" suffix="mi" {...register(`slabBands.${index}.fromMiles`)} hasError={!!errors.slabBands?.[index]?.fromMiles} />
                  </FormField>
                  <FormField label="To" htmlFor={`slabTo${index}`} error={errors.slabBands?.[index]?.toMiles?.message} className="w-20">
                    <TextInput id={`slabTo${index}`} inputMode="numeric" suffix="mi" {...register(`slabBands.${index}.toMiles`)} hasError={!!errors.slabBands?.[index]?.toMiles} />
                  </FormField>
                  <FormField label="Flat price" htmlFor={`slabPrice${index}`} error={errors.slabBands?.[index]?.price?.message} className="flex-1">
                    <TextInput id={`slabPrice${index}`} inputMode="decimal" prefix="£" {...register(`slabBands.${index}.price`)} hasError={!!errors.slabBands?.[index]?.price} />
                  </FormField>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => slabBandsArray.remove(index)}
                    disabled={slabBandsArray.fields.length === 1}
                    className="mb-0.5 text-danger hover:bg-danger-soft"
                  >
                    <Trash2 className="size-4" strokeWidth={2} />
                  </Button>
                </div>
              ))}

              <Button type="button" variant="secondary" icon={Plus} onClick={addSlabBand}>
                Add item
              </Button>
            </div>
          )}
        </FormSection>
      </form>
    </Modal>
  )
}
