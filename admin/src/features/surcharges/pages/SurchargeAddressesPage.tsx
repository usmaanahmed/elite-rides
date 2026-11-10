import { Map, Plus } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../../../shared/components/buttons/Button'
import { EmptyStateCard } from '../../../shared/components/cards/EmptyStateCard'
import { Alert } from '../../../shared/components/feedback/Alert'
import { ConfirmDeleteModal } from '../../../shared/components/modals/ConfirmDeleteModal'
import { PageHeader } from '../../../shared/components/PageHeader'
import { SurchargeAddressModal } from '../components/SurchargeAddressModal'
import { SurchargeAddressesTable } from '../components/SurchargeAddressesTable'
import { useDeleteSurchargeAddress, useSurchargeAddresses } from '../hooks/useSurchargeAddresses'
import type { SurchargeAddress } from '../types/surchargeAddress'

export function SurchargeAddressesPage() {
  // The surcharge addresses from the server (React Query keeps it cached and up to date)
  const addressesQuery = useSurchargeAddresses()
  const deleteMutation = useDeleteSurchargeAddress()

  const [isModalOpen, setIsModalOpen] = useState(false)
  // The address open in the modal for editing (null = the modal adds a new address)
  const [addressToEdit, setAddressToEdit] = useState<SurchargeAddress | null>(null)
  // The address waiting for the user to confirm its deletion (null = no dialog)
  const [addressToDelete, setAddressToDelete] = useState<SurchargeAddress | null>(null)
  // Text of the success message (null = no message)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  function openAddModal() {
    setSuccessMessage(null)
    setAddressToEdit(null)
    setIsModalOpen(true)
  }

  function openEditModal(address: SurchargeAddress) {
    setSuccessMessage(null)
    setAddressToEdit(address)
    setIsModalOpen(true)
  }

  function handleAddressSaved(address: SurchargeAddress, wasEdit: boolean) {
    if (wasEdit) {
      setSuccessMessage(`Surcharge for "${address.address}" was updated`)
    } else {
      setSuccessMessage(`Surcharge added for "${address.address}" from ${address.fromTime} to ${address.toTime}`)
    }
  }

  function openDeleteDialog(address: SurchargeAddress) {
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
      setSuccessMessage(`Surcharge for "${addressToDelete.address}" was deleted`)
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
            title="Surcharge addresses could not be loaded"
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
          icon={Map}
          title="No address surcharges yet"
          description="Add an address, such as an airport, to charge extra for it."
          action={
            <Button variant="secondary" icon={Plus} onClick={openAddModal}>
              Add surcharge
            </Button>
          }
          className="mt-8"
        />
      )
    }

    return (
      <div className="mt-8">
        <SurchargeAddressesTable addresses={addressesQuery.data} onEdit={openEditModal} onDelete={openDeleteDialog} />
      </div>
    )
  }

  return (
    <>
      <PageHeader
        title="Surcharge Addresses"
        description="Extra charges added for pickups or drop-offs at certain addresses."
        actions={
          <Button icon={Plus} onClick={openAddModal}>
            Add surcharge
          </Button>
        }
      />

      {successMessage && (
        <Alert variant="success" title={successMessage} onDismiss={() => setSuccessMessage(null)} className="mt-6" />
      )}

      {renderAddresses()}

      <SurchargeAddressModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        addressToEdit={addressToEdit}
        onSaved={handleAddressSaved}
      />

      <ConfirmDeleteModal
        isOpen={addressToDelete !== null}
        onClose={closeDeleteDialog}
        onConfirm={confirmDelete}
        title="Delete surcharge address?"
        isDeleting={deleteMutation.isPending}
        errorMessage={deleteMutation.isError ? deleteMutation.error.message : null}
      >
        <p>
          The surcharge for <span className="font-semibold text-ink">{addressToDelete?.address}</span> will be
          removed. To keep it but stop charging it, set its status to Inactive instead.
        </p>
      </ConfirmDeleteModal>
    </>
  )
}
