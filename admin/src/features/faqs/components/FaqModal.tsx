import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Alert } from '../../../shared/components/feedback/Alert'
import { FormField } from '../../../shared/components/forms/FormField'
import { FormModalFooter } from '../../../shared/components/forms/FormModalFooter'
import { TextArea } from '../../../shared/components/inputs/TextArea'
import { TextInput } from '../../../shared/components/inputs/TextInput'
import { Modal } from '../../../shared/components/modals/Modal'
import { useAddFaq, useEditFaq } from '../hooks/useFaqs'
import { ANSWER_MAX_LENGTH, faqFormSchema, QUESTION_MAX_LENGTH } from '../schemas/faqFormSchema'
import type { Faq, NewFaq } from '../types/faq'

type FaqModalProps = {
  isOpen: boolean
  onClose: () => void
  // The FAQ being edited. null means the modal adds a new one.
  faqToEdit: Faq | null
  // Called with the saved FAQ after it has been added or updated
  onSaved: (faq: Faq, wasEdit: boolean) => void
}

// Lets the footer's Save button (which sits outside the <form>) submit the form
const FORM_ID = 'faq-form'

const emptyFormValues: NewFaq = { question: '', answer: '' }

// One modal for both adding a new FAQ and editing an existing one
export function FaqModal({ isOpen, onClose, faqToEdit, onSaved }: FaqModalProps) {
  // React Compiler can cache React Hook Form's changing formState (errors, isDirty) and show stale errors, so skip it here
  'use no memo'

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<NewFaq>({
    resolver: zodResolver(faqFormSchema),
    defaultValues: emptyFormValues,
    // Check a field once the user leaves it, then re-check it live as they fix it
    mode: 'onTouched',
  })

  const addMutation = useAddFaq()
  const editMutation = useEditFaq()

  const isEditing = faqToEdit !== null

  // Every time the modal opens, fill the form with the FAQ being edited (or empty for a new one)
  useEffect(() => {
    if (!isOpen) return
    if (faqToEdit) {
      reset({ question: faqToEdit.question, answer: faqToEdit.answer })
    } else {
      reset(emptyFormValues)
    }
  }, [isOpen, faqToEdit, reset])

  function handleClose() {
    // Don't allow closing halfway through saving
    if (isSubmitting) return
    onClose()
  }

  // Only runs once every field has passed validation
  async function saveFaq(values: NewFaq) {
    try {
      let savedFaq: Faq
      if (faqToEdit) {
        savedFaq = await editMutation.mutateAsync({ faqId: faqToEdit.id, faq: values })
      } else {
        savedFaq = await addMutation.mutateAsync(values)
      }
      onSaved(savedFaq, isEditing)
      onClose()
    } catch (error) {
      let message = 'The FAQ could not be saved. Please try again.'
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
      title={isEditing ? 'Edit FAQ' : 'Add FAQ'}
      description="One question with its answer. It shows on the website."
      footer={
        <FormModalFooter
          formId={FORM_ID}
          submitLabel="Save FAQ"
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
      <form id={FORM_ID} onSubmit={handleSubmit(saveFaq)} noValidate className="space-y-5">
        {errors.root?.message && <Alert variant="error" title={errors.root.message} />}

        <FormField label="Question" htmlFor="faqQuestion" error={errors.question?.message}>
          <TextInput
            id="faqQuestion"
            placeholder="e.g. How do I change my booking?"
            autoComplete="off"
            maxLength={QUESTION_MAX_LENGTH}
            {...register('question')}
            hasError={!!errors.question}
          />
        </FormField>

        <FormField label="Answer" htmlFor="faqAnswer" error={errors.answer?.message}>
          <TextArea
            id="faqAnswer"
            rows={6}
            placeholder="Write the answer customers will see"
            maxLength={ANSWER_MAX_LENGTH}
            {...register('answer')}
            hasError={!!errors.answer}
          />
        </FormField>
      </form>
    </Modal>
  )
}
