import { Map, Plus } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../../../shared/components/buttons/Button'
import { EmptyStateCard } from '../../../shared/components/cards/EmptyStateCard'
import { Alert } from '../../../shared/components/feedback/Alert'
import { PageHeader } from '../../../shared/components/PageHeader'
import { AddSurchargeAddressModal } from '../components/AddSurchargeAddressModal'
import type { NewSurchargeAddress } from '../types/surchargeAddress'

export function SurchargeAddressesPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  // Text of the success message after an address is added (null = no message)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  function openAddModal() {
    setSuccessMessage(null)
    setIsAddModalOpen(true)
  }

  function handleSurchargeAddressAdded(surchargeAddress: NewSurchargeAddress) {
    setSuccessMessage(
      `Surcharge added for "${surchargeAddress.address}" from ${surchargeAddress.fromTime} to ${surchargeAddress.toTime}`,
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

      <AddSurchargeAddressModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSurchargeAddressAdded={handleSurchargeAddressAdded}
      />
    </>
  )
}
