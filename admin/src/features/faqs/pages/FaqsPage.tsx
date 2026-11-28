import { CircleHelp, Plus } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../../../shared/components/buttons/Button'
import { EmptyStateCard } from '../../../shared/components/cards/EmptyStateCard'
import { Alert } from '../../../shared/components/feedback/Alert'
import { ConfirmDeleteModal } from '../../../shared/components/modals/ConfirmDeleteModal'
import { PageHeader } from '../../../shared/components/PageHeader'
import { FaqModal } from '../components/FaqModal'
import { FaqsTable } from '../components/FaqsTable'
import { useDeleteFaq, useFaqs } from '../hooks/useFaqs'
import type { Faq } from '../types/faq'

// The FAQs page: a table of all questions and answers with add, edit and delete
export function FaqsPage() {
  // The FAQs from the server (React Query keeps it cached and up to date)
  const faqsQuery = useFaqs()
  const deleteMutation = useDeleteFaq()

  const [isModalOpen, setIsModalOpen] = useState(false)
  // The FAQ open in the modal for editing (null = the modal adds a new FAQ)
  const [faqToEdit, setFaqToEdit] = useState<Faq | null>(null)
  // The FAQ waiting for the user to confirm its deletion (null = no dialog)
  const [faqToDelete, setFaqToDelete] = useState<Faq | null>(null)
  // Text of the success message (null = no message)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  function openAddModal() {
    setSuccessMessage(null)
    setFaqToEdit(null)
    setIsModalOpen(true)
  }

  function openEditModal(faq: Faq) {
    setSuccessMessage(null)
    setFaqToEdit(faq)
    setIsModalOpen(true)
  }

  function handleFaqSaved(_savedFaq: Faq, wasEdit: boolean) {
    if (wasEdit) {
      setSuccessMessage('The FAQ was updated')
    } else {
      setSuccessMessage('The FAQ was added')
    }
  }

  function openDeleteDialog(faq: Faq) {
    deleteMutation.reset()
    setFaqToDelete(faq)
  }

  function closeDeleteDialog() {
    // Don't allow closing halfway through deleting
    if (deleteMutation.isPending) return
    setFaqToDelete(null)
  }

  async function confirmDelete() {
    if (!faqToDelete) return

    try {
      await deleteMutation.mutateAsync(faqToDelete.id)
      setSuccessMessage('The FAQ was deleted')
      setFaqToDelete(null)
    } catch {
      // The error is shown inside the dialog
    }
  }

  // Works out what the main part of the page should show
  function renderFaqs() {
    if (faqsQuery.isPending) {
      return <div className="mt-8 h-48 animate-pulse rounded-2xl bg-surface-muted" />
    }

    if (faqsQuery.isError) {
      return (
        <div className="mt-8 space-y-3">
          <Alert variant="error" title="FAQs could not be loaded" description={faqsQuery.error.message} />
          <Button variant="secondary" onClick={() => faqsQuery.refetch()} isLoading={faqsQuery.isFetching}>
            Try again
          </Button>
        </div>
      )
    }

    if (faqsQuery.data.length === 0) {
      return (
        <EmptyStateCard
          icon={CircleHelp}
          title="No FAQs yet"
          description="Add a question with its answer. It will show on the website."
          action={
            <Button variant="secondary" icon={Plus} onClick={openAddModal}>
              Add FAQ
            </Button>
          }
          className="mt-8"
        />
      )
    }

    return (
      <div className="mt-8">
        <FaqsTable faqs={faqsQuery.data} onEdit={openEditModal} onDelete={openDeleteDialog} />
      </div>
    )
  }

  return (
    <>
      <PageHeader
        title="FAQs"
        description="Questions and answers shown in the FAQ section of the website."
        actions={
          <Button icon={Plus} onClick={openAddModal}>
            Add FAQ
          </Button>
        }
      />

      {successMessage && (
        <Alert variant="success" title={successMessage} onDismiss={() => setSuccessMessage(null)} className="mt-6" />
      )}

      {renderFaqs()}

      <FaqModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        faqToEdit={faqToEdit}
        onSaved={handleFaqSaved}
      />

      <ConfirmDeleteModal
        isOpen={faqToDelete !== null}
        onClose={closeDeleteDialog}
        onConfirm={confirmDelete}
        title="Delete FAQ?"
        isDeleting={deleteMutation.isPending}
        errorMessage={deleteMutation.isError ? deleteMutation.error.message : null}
      >
        <p>
          <span className="font-semibold text-ink">{faqToDelete?.question}</span> will be deleted. This cannot be
          undone.
        </p>
      </ConfirmDeleteModal>
    </>
  )
}
