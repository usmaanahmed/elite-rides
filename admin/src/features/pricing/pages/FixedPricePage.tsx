import { Banknote, Plus } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../../../shared/components/buttons/Button'
import { EmptyStateCard } from '../../../shared/components/cards/EmptyStateCard'
import { Alert } from '../../../shared/components/feedback/Alert'
import { PageHeader } from '../../../shared/components/PageHeader'
import { AddFixedPriceModal } from '../components/AddFixedPriceModal'
import type { NewFixedPrice } from '../types/fixedPrice'

export function FixedPricePage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  // Text of the success message after a route is added (null = no message)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  function openAddModal() {
    setSuccessMessage(null)
    setIsAddModalOpen(true)
  }

  function handleFixedPriceAdded(fixedPrice: NewFixedPrice) {
    setSuccessMessage(`Fixed price added for ${fixedPrice.pickupPostcode} → ${fixedPrice.dropoffPostcode}`)
  }

  return (
    <>
      <PageHeader
        title="Fixed Price Setting"
        description="Set fixed prices for journeys between two places."
        actions={
          <Button icon={Plus} onClick={openAddModal}>
            Add fixed price
          </Button>
        }
      />

      {successMessage && (
        <Alert variant="success" title={successMessage} onDismiss={() => setSuccessMessage(null)} className="mt-6" />
      )}

      <EmptyStateCard
        icon={Banknote}
        title="No fixed prices yet"
        description="Fixed prices override the mileage rate for a journey."
        action={
          <Button variant="secondary" icon={Plus} onClick={openAddModal}>
            Add fixed price
          </Button>
        }
        className="mt-8"
      />

      <AddFixedPriceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onFixedPriceAdded={handleFixedPriceAdded}
      />
    </>
  )
}
