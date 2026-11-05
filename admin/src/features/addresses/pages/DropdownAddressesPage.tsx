import { MapPin, Plus } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../../../shared/components/buttons/Button'
import { EmptyStateCard } from '../../../shared/components/cards/EmptyStateCard'
import { Alert } from '../../../shared/components/feedback/Alert'
import { PageHeader } from '../../../shared/components/PageHeader'
import { AddDropdownAddressModal } from '../components/AddDropdownAddressModal'
import type { NewDropdownAddress } from '../types/dropdownAddress'

export function DropdownAddressesPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  // Text of the success message after an address is added (null = no message)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  function openAddModal() {
    setSuccessMessage(null)
    setIsAddModalOpen(true)
  }

  function handleAddressAdded(address: NewDropdownAddress) {
    setSuccessMessage(`Address added: ${address.address}`)
  }

  return (
    <>
      <PageHeader
        title="Drop down Addresses"
        description="Addresses customers can pick from the drop down when booking."
        actions={
          <Button icon={Plus} onClick={openAddModal}>
            Add address
          </Button>
        }
      />

      {successMessage && (
        <Alert variant="success" title={successMessage} onDismiss={() => setSuccessMessage(null)} className="mt-6" />
      )}

      <EmptyStateCard
        icon={MapPin}
        title="No drop down addresses yet"
        description="Add an address to make it selectable in the booking form."
        action={
          <Button variant="secondary" icon={Plus} onClick={openAddModal}>
            Add address
          </Button>
        }
        className="mt-8"
      />

      <AddDropdownAddressModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddressAdded={handleAddressAdded}
      />
    </>
  )
}
