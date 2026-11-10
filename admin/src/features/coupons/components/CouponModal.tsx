import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Alert } from '../../../shared/components/feedback/Alert'
import { FormField } from '../../../shared/components/forms/FormField'
import { FormModalFooter } from '../../../shared/components/forms/FormModalFooter'
import { SelectInput } from '../../../shared/components/inputs/SelectInput'
import { TextInput } from '../../../shared/components/inputs/TextInput'
import { Modal } from '../../../shared/components/modals/Modal'
import { COUPON_STATUS_OPTIONS, DISCOUNT_TYPE_OPTIONS } from '../constants/couponOptions'
import { useAddCoupon, useEditCoupon } from '../hooks/useCoupons'
import { CODE_MAX_LENGTH, couponFormSchema } from '../schemas/couponFormSchema'
import type { Coupon, CouponFormValues, NewCoupon } from '../types/coupon'

type CouponModalProps = {
  isOpen: boolean
  onClose: () => void
  // The coupon being edited. null means the modal creates a new one.
  couponToEdit: Coupon | null
  // Called with the saved coupon after it has been created or updated
  onSaved: (coupon: Coupon, wasEdit: boolean) => void
}

// Lets the footer's Save button (which sits outside the <form>) submit the form
const FORM_ID = 'coupon-form'

const emptyFormValues: CouponFormValues = {
  code: '',
  discountType: 'percent',
  discountValue: '',
  expiryDate: '',
  usageLimit: '',
  status: 'active',
}

// One modal for both creating a new coupon and editing an existing one
export function CouponModal({ isOpen, onClose, couponToEdit, onSaved }: CouponModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<CouponFormValues>({
    resolver: zodResolver(couponFormSchema),
    defaultValues: emptyFormValues,
    // Check a field once the user leaves it, then re-check it live as they fix it
    mode: 'onTouched',
  })

  const addMutation = useAddCoupon()
  const editMutation = useEditCoupon()

  const isEditing = couponToEdit !== null
  // The discount box shows £ or % next to it, depending on the chosen type
  const discountType = watch('discountType')

  // Every time the modal opens, fill the form with the coupon being edited (or empty for a new one)
  useEffect(() => {
    if (!isOpen) return
    if (couponToEdit) {
      let usageLimitText = ''
      if (couponToEdit.usageLimit > 0) {
        usageLimitText = String(couponToEdit.usageLimit)
      }
      reset({
        code: couponToEdit.code,
        discountType: couponToEdit.discountType,
        discountValue: String(couponToEdit.discountValue),
        expiryDate: couponToEdit.expiryDate,
        usageLimit: usageLimitText,
        status: couponToEdit.status,
      })
    } else {
      reset(emptyFormValues)
    }
  }, [isOpen, couponToEdit, reset])

  function handleClose() {
    // Don't allow closing halfway through saving
    if (isSubmitting) return
    onClose()
  }

  // Only runs once every field has passed validation (the schema has already uppercased the code)
  async function saveCoupon(values: CouponFormValues) {
    // An empty usage limit means unlimited, which the server stores as 0
    let usageLimit = 0
    if (values.usageLimit !== '') {
      usageLimit = Number(values.usageLimit)
    }

    const couponData: NewCoupon = {
      code: values.code,
      discountType: values.discountType,
      discountValue: Number(values.discountValue),
      expiryDate: values.expiryDate,
      usageLimit: usageLimit,
      status: values.status,
    }

    try {
      let savedCoupon: Coupon
      if (couponToEdit) {
        savedCoupon = await editMutation.mutateAsync({ couponId: couponToEdit.id, coupon: couponData })
      } else {
        savedCoupon = await addMutation.mutateAsync(couponData)
      }
      onSaved(savedCoupon, isEditing)
      onClose()
    } catch (error) {
      // Show the server's message (e.g. "code already exists") when there is one
      let message = 'The coupon could not be saved. Please try again.'
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
      title={isEditing ? 'Edit coupon' : 'Create coupon'}
      description="Customers type the code at checkout to get the discount."
      size="small"
      footer={
        <FormModalFooter
          formId={FORM_ID}
          submitLabel="Save coupon"
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
      <form id={FORM_ID} onSubmit={handleSubmit(saveCoupon)} noValidate className="space-y-5">
        {errors.root?.message && <Alert variant="error" title={errors.root.message} />}

        <FormField
          label="Coupon code"
          htmlFor="code"
          hint="Letters and numbers only, e.g. SAVE10."
          error={errors.code?.message}
        >
          <TextInput
            id="code"
            placeholder="SAVE10"
            autoComplete="off"
            maxLength={CODE_MAX_LENGTH}
            {...register('code')}
            hasError={!!errors.code}
          />
        </FormField>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Discount type" htmlFor="discountType" error={errors.discountType?.message}>
            <SelectInput
              id="discountType"
              options={DISCOUNT_TYPE_OPTIONS}
              {...register('discountType')}
              hasError={!!errors.discountType}
            />
          </FormField>

          <FormField label="Discount" htmlFor="discountValue" error={errors.discountValue?.message}>
            <TextInput
              id="discountValue"
              inputMode="decimal"
              placeholder="0.00"
              prefix={discountType === 'fixed' ? '£' : undefined}
              suffix={discountType === 'percent' ? '%' : undefined}
              {...register('discountValue')}
              hasError={!!errors.discountValue}
            />
          </FormField>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            label="Expiry date (optional)"
            htmlFor="expiryDate"
            hint="Empty = never expires."
            error={errors.expiryDate?.message}
          >
            <TextInput id="expiryDate" type="date" {...register('expiryDate')} hasError={!!errors.expiryDate} />
          </FormField>

          <FormField
            label="Usage limit (optional)"
            htmlFor="usageLimit"
            hint="Empty or 0 = unlimited."
            error={errors.usageLimit?.message}
          >
            <TextInput
              id="usageLimit"
              inputMode="numeric"
              placeholder="Unlimited"
              {...register('usageLimit')}
              hasError={!!errors.usageLimit}
            />
          </FormField>
        </div>

        <FormField
          label="Status"
          htmlFor="status"
          hint="Set to Inactive to disable the coupon. You can turn it back on later."
          error={errors.status?.message}
        >
          <SelectInput id="status" options={COUPON_STATUS_OPTIONS} {...register('status')} hasError={!!errors.status} />
        </FormField>
      </form>
    </Modal>
  )
}
