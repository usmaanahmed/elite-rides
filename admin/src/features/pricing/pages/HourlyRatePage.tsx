import { Clock, Plus } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../../../shared/components/buttons/Button'
import { EmptyStateCard } from '../../../shared/components/cards/EmptyStateCard'
import { Alert } from '../../../shared/components/feedback/Alert'
import { PageHeader } from '../../../shared/components/PageHeader'
import { getVehicleTypeName } from '../../vehicles/constants/vehicleTypes'
import { AddHourlyRateModal } from '../components/AddHourlyRateModal'
import type { NewHourlyRate } from '../types/hourlyRate'

export function HourlyRatePage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  // Text of the success message after a rate is added (null = no message)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  function openAddModal() {
    setSuccessMessage(null)
    setIsAddModalOpen(true)
  }

  function handleHourlyRateAdded(hourlyRate: NewHourlyRate) {
    const vehicleName = getVehicleTypeName(hourlyRate.vehicleTypeId)
    setSuccessMessage(`Hourly rate of £${hourlyRate.ratePerHour.toFixed(2)} added for ${vehicleName}`)
  }

  return (
    <>
      <PageHeader
        title="Hourly Rate"
        description="Set the hourly rate for each vehicle type."
        actions={
          <Button icon={Plus} onClick={openAddModal}>
            Add hourly rate
          </Button>
        }
      />

      {successMessage && (
        <Alert variant="success" title={successMessage} onDismiss={() => setSuccessMessage(null)} className="mt-6" />
      )}

      <EmptyStateCard
        icon={Clock}
        title="No hourly rates yet"
        description="Hourly rates are used for bookings charged by time."
        action={
          <Button variant="secondary" icon={Plus} onClick={openAddModal}>
            Add hourly rate
          </Button>
        }
        className="mt-8"
      />

      <AddHourlyRateModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onHourlyRateAdded={handleHourlyRateAdded}
      />
    </>
  )
}
