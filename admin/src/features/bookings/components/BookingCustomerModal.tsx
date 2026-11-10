import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Alert } from '../../../shared/components/feedback/Alert'
import { FormField } from '../../../shared/components/forms/FormField'
import { FormModalFooter } from '../../../shared/components/forms/FormModalFooter'
import { SelectInput, type SelectOption } from '../../../shared/components/inputs/SelectInput'
import { TextArea } from '../../../shared/components/inputs/TextArea'
import { TextInput } from '../../../shared/components/inputs/TextInput'
import { Modal } from '../../../shared/components/modals/Modal'
import { PAYMENT_METHOD_LABELS } from '../constants/paymentMethods'
import { bookingCustomerFormSchema, type BookingCustomerFormValues } from '../schemas/bookingCustomerFormSchema'

type BookingCustomerModalProps = {
  isOpen: boolean
  onClose: () => void
  // Name of the chosen vehicle and its price, shown at the top
  vehicleName: string
  total: number
  // Text of a server error from the last attempt (empty = none)
  errorMessage: string
  isSaving: boolean
  onSave: (values: BookingCustomerFormValues) => void
}

// Lets the footer's Save button (which sits outside the <form>) submit the form
const FORM_ID = 'booking-customer-form'

const PAYMENT_OPTIONS: SelectOption[] = [
  { value: 'pay_cash', label: PAYMENT_METHOD_LABELS.pay_cash },
  { value: 'pay_card', label: PAYMENT_METHOD_LABELS.pay_card },
]

const emptyFormValues: BookingCustomerFormValues = {
  name: '',
  email: '',
  phone: '',
  luggage: '0',
  flightNo: '',
  arrivalFrom: '',
  paymentMethod: 'pay_cash',
  notes: '',
}

// Asks for the passenger's details before the booking is created
export function BookingCustomerModal({
  isOpen,
  onClose,
  vehicleName,
  total,
  errorMessage,
  isSaving,
  onSave,
}: BookingCustomerModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<BookingCustomerFormValues>({
    resolver: zodResolver(bookingCustomerFormSchema),
    defaultValues: emptyFormValues,
    mode: 'onTouched',
  })

  // Every time the modal opens, start with an empty form
  useEffect(() => {
    if (isOpen) {
      reset(emptyFormValues)
    }
  }, [isOpen, reset])

  function handleClose() {
    // Don't allow closing halfway through saving
    if (isSaving) return
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Passenger details"
      description={`${vehicleName} – £${total.toFixed(2)}`}
      size="small"
      footer={
        <FormModalFooter
          formId={FORM_ID}
          submitLabel="Create booking"
          isSubmitting={isSaving}
          canReset={isDirty}
          onReset={() => reset()}
          onCancel={handleClose}
        />
      }
      closeOnBackdropClick={!isDirty}
    >
      {/* noValidate turns off the browser's own validation popups, so only our messages show */}
      <form id={FORM_ID} onSubmit={handleSubmit(onSave)} noValidate className="space-y-5">
        {errorMessage && <Alert variant="error" title={errorMessage} />}

        <FormField label="Passenger name" htmlFor="name" error={errors.name?.message}>
          <TextInput id="name" autoComplete="off" {...register('name')} hasError={!!errors.name} />
        </FormField>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Email" htmlFor="email" error={errors.email?.message}>
            <TextInput id="email" type="email" autoComplete="off" {...register('email')} hasError={!!errors.email} />
          </FormField>
          <FormField label="Phone" htmlFor="phone" error={errors.phone?.message}>
            <TextInput id="phone" type="tel" autoComplete="off" {...register('phone')} hasError={!!errors.phone} />
          </FormField>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Luggage (bags)" htmlFor="luggage" error={errors.luggage?.message}>
            <TextInput id="luggage" inputMode="numeric" {...register('luggage')} hasError={!!errors.luggage} />
          </FormField>
          <FormField label="Payment" htmlFor="paymentMethod" error={errors.paymentMethod?.message}>
            <SelectInput id="paymentMethod" options={PAYMENT_OPTIONS} {...register('paymentMethod')} />
          </FormField>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Flight no. (optional)" htmlFor="flightNo" error={errors.flightNo?.message}>
            <TextInput id="flightNo" autoComplete="off" {...register('flightNo')} hasError={!!errors.flightNo} />
          </FormField>
          <FormField label="Arriving from (optional)" htmlFor="arrivalFrom" error={errors.arrivalFrom?.message}>
            <TextInput id="arrivalFrom" autoComplete="off" {...register('arrivalFrom')} hasError={!!errors.arrivalFrom} />
          </FormField>
        </div>

        <FormField label="Notes (optional)" htmlFor="notes" error={errors.notes?.message}>
          <TextArea id="notes" rows={2} {...register('notes')} hasError={!!errors.notes} />
        </FormField>
      </form>
    </Modal>
  )
}
