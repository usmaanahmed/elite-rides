import { MapPinOff, Plus } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../../../shared/components/buttons/Button'
import { EmptyStateCard } from '../../../shared/components/cards/EmptyStateCard'
import { Alert } from '../../../shared/components/feedback/Alert'
import { ConfirmDeleteModal } from '../../../shared/components/modals/ConfirmDeleteModal'
import { PageHeader } from '../../../shared/components/PageHeader'
import { AddBanAddressModal } from '../components/AddBanAddressModal'
import { BanAddressesTable } from '../components/BanAddressesTable'
import { useBanAddresses, useDeleteBanAddress } from '../hooks/useBanAddresses'
import type { BanAddress } from '../types/banAddress'

export function BanAddressesPage() {
  // The banned addresses from the server (React Query keeps it cached and up to date)
  const addressesQuery = useBanAddresses()
  const deleteMutation = useDeleteBanAddress()

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  // The address waiting for the user to confirm removing it (null = no dialog)
  const [addressToDelete, setAddressToDelete] = useState<BanAddress | null>(null)
  // Text of the success message (null = no message)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  function openAddModal() {
    setSuccessMessage(null)
    setIsAddModalOpen(true)
  }

  function handleBanAddressAdded(banAddress: BanAddress) {
    setSuccessMessage(`"${banAddress.address}" has been banned`)
  }

  function openDeleteDialog(address: BanAddress) {
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
      setSuccessMessage(`"${addressToDelete.address}" is no longer banned`)
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
          <Alert variant="error" title="Banned addresses could not be loaded" description={addressesQuery.error.message} />
          <Button variant="secondary" onClick={() => addressesQuery.refetch()} isLoading={addressesQuery.isFetching}>
            Try again
          </Button>
        </div>
      )
    }

    if (addressesQuery.data.length === 0) {
      return (
        <EmptyStateCard
          icon={MapPinOff}
          title="No banned addresses"
          description="Banned addresses will be blocked in the booking form."
          action={
            <Button variant="secondary" icon={Plus} onClick={openAddModal}>
              Ban address
            </Button>
          }
          className="mt-8"
        />
      )
    }

    return (
      <div className="mt-8">
        <BanAddressesTable addresses={addressesQuery.data} onDelete={openDeleteDialog} />
      </div>
    )
  }

  return (
    <>
      <PageHeader
        title="Ban Addresses"
        description="Addresses that cannot be used for pickup or drop-off."
        actions={
          <Button icon={Plus} onClick={openAddModal}>
            Ban address
          </Button>
        }
      />

      {successMessage && (
        <Alert variant="success" title={successMessage} onDismiss={() => setSuccessMessage(null)} className="mt-6" />
      )}

      {renderAddresses()}

      <AddBanAddressModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onBanAddressAdded={handleBanAddressAdded}
      />

      <ConfirmDeleteModal
        isOpen={addressToDelete !== null}
        onClose={closeDeleteDialog}
        onConfirm={confirmDelete}
        title="Remove from ban list?"
        confirmLabel="Remove"
        isDeleting={deleteMutation.isPending}
        errorMessage={deleteMutation.isError ? deleteMutation.error.message : null}
      >
        <p>
          <span className="font-semibold text-ink">{addressToDelete?.address}</span> will no longer be banned. Customers
          will be able to use it for pickup and drop-off again.
        </p>
      </ConfirmDeleteModal>
    </>
  )
}
