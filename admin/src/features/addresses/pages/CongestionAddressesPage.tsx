import { Plus, TrafficCone } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../../../shared/components/buttons/Button'
import { EmptyStateCard } from '../../../shared/components/cards/EmptyStateCard'
import { Alert } from '../../../shared/components/feedback/Alert'
import { ConfirmDeleteModal } from '../../../shared/components/modals/ConfirmDeleteModal'
import { PageHeader } from '../../../shared/components/PageHeader'
import { CongestionAddressModal } from '../components/CongestionAddressModal'
import { CongestionAddressesTable } from '../components/CongestionAddressesTable'
import { useCongestionAddresses, useDeleteCongestionAddress } from '../hooks/useCongestionAddresses'
import type { CongestionAddress } from '../types/congestionAddress'

export function CongestionAddressesPage() {
  // The congestion addresses from the server (React Query keeps it cached and up to date)
  const addressesQuery = useCongestionAddresses()
  const deleteMutation = useDeleteCongestionAddress()

  const [isModalOpen, setIsModalOpen] = useState(false)
  // The address open in the modal for editing (null = the modal adds a new address)
  const [addressToEdit, setAddressToEdit] = useState<CongestionAddress | null>(null)
  // The address waiting for the user to confirm its deletion (null = no dialog)
  const [addressToDelete, setAddressToDelete] = useState<CongestionAddress | null>(null)
  // Text of the success message (null = no message)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  function openAddModal() {
    setSuccessMessage(null)
    setAddressToEdit(null)
    setIsModalOpen(true)
  }

  function openEditModal(address: CongestionAddress) {
    setSuccessMessage(null)
    setAddressToEdit(address)
    setIsModalOpen(true)
  }

  function handleAddressSaved(address: CongestionAddress, wasEdit: boolean) {
    if (wasEdit) {
      setSuccessMessage(`${address.postcode} was updated`)
    } else {
      setSuccessMessage(`${address.postcode} was added`)
    }
  }

  function openDeleteDialog(address: CongestionAddress) {
    deleteMutation.reset()
    setAddressToDelete(address)
  }

  function closeDeleteDialog() {
    // Don't allow closing halfway through deleting
    if (deleteMutation.isPending) return
    setAddressToDelete(null)
  }

  async function confirmDelete() {
    if (!addressToDelete) return

    try {
      await deleteMutation.mutateAsync(addressToDelete.id)
      setSuccessMessage(`${addressToDelete.postcode} was deleted`)
      setAddressToDelete(null)
    } catch {
      // The error is shown inside the dialog
    }
  }

  // Works out what the main part of the page should show
  function renderAddresses() {
    if (addressesQuery.isPending) {
      return <div className="mt-8 h-48 animate-pulse rounded-2xl bg-surface-muted" />
    }

    if (addressesQuery.isError) {
      return (
        <div className="mt-8 space-y-3">
          <Alert
            variant="error"
            title="Congestion addresses could not be loaded"
            description={addressesQuery.error.message}
          />
          <Button variant="secondary" onClick={() => addressesQuery.refetch()} isLoading={addressesQuery.isFetching}>
            Try again
          </Button>
        </div>
      )
    }

    if (addressesQuery.data.length === 0) {
      return (
        <EmptyStateCard
          icon={TrafficCone}
          title="No congestion addresses yet"
          description="Add a postcode area to charge extra for journeys that start, pass or end there."
          action={
            <Button variant="secondary" icon={Plus} onClick={openAddModal}>
              Add congestion address
            </Button>
          }
          className="mt-8"
        />
      )
    }

    return (
      <div className="mt-8">
        <CongestionAddressesTable addresses={addressesQuery.data} onEdit={openEditModal} onDelete={openDeleteDialog} />
      </div>
    )
  }

  return (
    <>
      <PageHeader
        title="Congestion Addresses"
        description="Postcode areas with an extra congestion charge."
        actions={
          <Button icon={Plus} onClick={openAddModal}>
            Add congestion address
          </Button>
        }
      />

      {successMessage && (
        <Alert variant="success" title={successMessage} onDismiss={() => setSuccessMessage(null)} className="mt-6" />
      )}

      {renderAddresses()}

      <CongestionAddressModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        addressToEdit={addressToEdit}
        onSaved={handleAddressSaved}
      />

      <ConfirmDeleteModal
        isOpen={addressToDelete !== null}
        onClose={closeDeleteDialog}
        onConfirm={confirmDelete}
        title="Delete congestion address?"
        isDeleting={deleteMutation.isPending}
        errorMessage={deleteMutation.isError ? deleteMutation.error.message : null}
      >
        <p>
          The congestion charge for <span className="font-semibold text-ink">{addressToDelete?.postcode}</span> will be
          removed.
        </p>
      </ConfirmDeleteModal>
    </>
  )
}
