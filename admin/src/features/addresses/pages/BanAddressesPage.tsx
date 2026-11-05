import { MapPinOff, Plus } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../../../shared/components/buttons/Button'
import { EmptyStateCard } from '../../../shared/components/cards/EmptyStateCard'
import { Alert } from '../../../shared/components/feedback/Alert'
import { PageHeader } from '../../../shared/components/PageHeader'
import { AddBanAddressModal } from '../components/AddBanAddressModal'
import type { NewBanAddress } from '../types/banAddress'

export function BanAddressesPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  // Text of the success message after an address is banned (null = no message)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  function openAddModal() {
    setSuccessMessage(null)
    setIsAddModalOpen(true)
  }

  function handleBanAddressAdded(banAddress: NewBanAddress) {
    setSuccessMessage(`"${banAddress.address}" has been banned`)
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

      <AddBanAddressModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onBanAddressAdded={handleBanAddressAdded}
      />
    </>
  )
}
