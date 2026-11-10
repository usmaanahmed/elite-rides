import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '../../../shared/components/buttons/Button'
import { Card } from '../../../shared/components/cards/Card'
import { Alert } from '../../../shared/components/feedback/Alert'
import { FormField } from '../../../shared/components/forms/FormField'
import { SelectInput } from '../../../shared/components/inputs/SelectInput'
import { TextInput } from '../../../shared/components/inputs/TextInput'
import { AMOUNT_TYPE_OPTIONS, STATUS_OPTIONS } from '../constants/surchargeOptions'
import { useSaveSurchargeNight } from '../hooks/useSurchargeNight'
import { surchargeNightFormSchema } from '../schemas/surchargeNightFormSchema'
import type { SurchargeNight, SurchargeNightFormValues } from '../types/surchargeNight'

type SurchargeNightFormProps = {
  // The night surcharge as it is saved on the server
  surchargeNight: SurchargeNight
}

// The form for the single night surcharge. It applies to every vehicle and route.
export function SurchargeNightForm({ surchargeNight }: SurchargeNightFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<SurchargeNightFormValues>({
    resolver: zodResolver(surchargeNightFormSchema),
    defaultValues: {
      startTime: surchargeNight.startTime,
      endTime: surchargeNight.endTime,
      amountType: surchargeNight.amountType,
      amount: String(surchargeNight.amount),
      status: surchargeNight.status,
    },
    mode: 'onTouched',
  })

  const saveMutation = useSaveSurchargeNight()
  // Text of the success message (null = no message)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  // The amount box shows £ or % in front, depending on the chosen type
  const amountType = watch('amountType')

  async function saveNightSurcharge(values: SurchargeNightFormValues) {
    setSuccessMessage(null)

    try {
      const saved = await saveMutation.mutateAsync({
        startTime: values.startTime,
        endTime: values.endTime,
        amountType: values.amountType,
        amount: Number(values.amount),
        status: values.status,
      })
      // Make the form's "saved" values the new ones, so the Save button turns off again
      reset({
        startTime: saved.startTime,
        endTime: saved.endTime,
        amountType: saved.amountType,
        amount: String(saved.amount),
        status: saved.status,
      })
      setSuccessMessage('Night surcharge was saved')
    } catch (error) {
      let message = 'The night surcharge could not be saved. Please try again.'
      if (error instanceof Error && error.message) {
        message = error.message
      }
      // 'root' is a form-wide error that isn't tied to one field
      setError('root', { message })
    }
  }

  return (
    <Card className="mt-8 max-w-2xl">
      {/* noValidate turns off the browser's own validation popups, so only our messages show */}
      <form onSubmit={handleSubmit(saveNightSurcharge)} noValidate className="space-y-5">
        {successMessage && <Alert variant="success" title={successMessage} onDismiss={() => setSuccessMessage(null)} />}
        {errors.root?.message && <Alert variant="error" title={errors.root.message} />}

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Start time" htmlFor="startTime" error={errors.startTime?.message}>
            <TextInput id="startTime" type="time" {...register('startTime')} hasError={!!errors.startTime} />
          </FormField>

          <FormField
            label="End time"
            htmlFor="endTime"
            hint="Can be earlier than the start time, e.g. 22:00 to 06:00."
            error={errors.endTime?.message}
          >
            <TextInput id="endTime" type="time" {...register('endTime')} hasError={!!errors.endTime} />
          </FormField>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Amount type" htmlFor="amountType" error={errors.amountType?.message}>
            <SelectInput
              id="amountType"
              options={AMOUNT_TYPE_OPTIONS}
              {...register('amountType')}
              hasError={!!errors.amountType}
            />
          </FormField>

          <FormField label="Amount" htmlFor="amount" error={errors.amount?.message}>
            <TextInput
              id="amount"
              inputMode="decimal"
              placeholder="0.00"
              prefix={amountType === 'fixed' ? '£' : undefined}
              suffix={amountType === 'percent' ? '%' : undefined}
              {...register('amount')}
              hasError={!!errors.amount}
            />
          </FormField>
        </div>

        <FormField
          label="Status"
          htmlFor="status"
          hint="Inactive means the night surcharge is never added to a fare."
          error={errors.status?.message}
        >
          <SelectInput id="status" options={STATUS_OPTIONS} {...register('status')} hasError={!!errors.status} />
        </FormField>

        <div className="flex justify-end">
          <Button type="submit" isLoading={isSubmitting} disabled={!isDirty}>
            Save night surcharge
          </Button>
        </div>
      </form>
    </Card>
  )
}
