import { BadgeCheck, Plus, PoundSterling, Repeat, Ticket } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../../../shared/components/buttons/Button'
import { EmptyStateCard } from '../../../shared/components/cards/EmptyStateCard'
import { StatCard } from '../../../shared/components/cards/StatCard'
import { Alert } from '../../../shared/components/feedback/Alert'
import { PageHeader } from '../../../shared/components/PageHeader'
import { formatCount, formatPounds } from '../../../shared/utils/formatNumbers'
import { CouponModal } from '../components/CouponModal'
import { CouponsTable } from '../components/CouponsTable'
import { useCouponStats, useCoupons } from '../hooks/useCoupons'
import type { Coupon } from '../types/coupon'

export function CouponsPage() {
  // The coupons and their stats from the server (React Query keeps them cached and up to date)
  const couponsQuery = useCoupons()
  const statsQuery = useCouponStats()

  const [isModalOpen, setIsModalOpen] = useState(false)
  // The coupon open in the modal for editing (null = the modal creates a new coupon)
  const [couponToEdit, setCouponToEdit] = useState<Coupon | null>(null)
  // Text of the success message (null = no message)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  function openCreateModal() {
    setSuccessMessage(null)
    setCouponToEdit(null)
    setIsModalOpen(true)
  }

  function openEditModal(coupon: Coupon) {
    setSuccessMessage(null)
    setCouponToEdit(coupon)
    setIsModalOpen(true)
  }

  function handleCouponSaved(coupon: Coupon, wasEdit: boolean) {
    if (wasEdit) {
      setSuccessMessage(`Coupon ${coupon.code} was updated`)
    } else {
      setSuccessMessage(`Coupon ${coupon.code} was created`)
    }
  }

  // The 4 summary cards. While the stats load (or fail) they show a dash.
  function renderStats() {
    let totalCoupons = '–'
    let activeCoupons = '–'
    let totalUsage = '–'
    let totalDiscountGiven = '–'

    if (statsQuery.data) {
      totalCoupons = formatCount(statsQuery.data.totalCoupons)
      activeCoupons = formatCount(statsQuery.data.activeCoupons)
      totalUsage = formatCount(statsQuery.data.totalUsage)
      totalDiscountGiven = formatPounds(statsQuery.data.totalDiscountGiven)
    }

    return (
      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Total coupons" value={totalCoupons} icon={Ticket} />
        <StatCard label="Active coupons" value={activeCoupons} icon={BadgeCheck} />
        <StatCard label="Total usage" value={totalUsage} icon={Repeat} />
        <StatCard label="Total discount given" value={totalDiscountGiven} icon={PoundSterling} />
      </div>
    )
  }

  // Works out what the main part of the page should show
  function renderCoupons() {
    if (couponsQuery.isPending) {
      return <div className="mt-8 h-48 animate-pulse rounded-2xl bg-surface-muted" />
    }

    if (couponsQuery.isError) {
      return (
        <div className="mt-8 space-y-3">
          <Alert variant="error" title="Coupons could not be loaded" description={couponsQuery.error.message} />
          <Button variant="secondary" onClick={() => couponsQuery.refetch()} isLoading={couponsQuery.isFetching}>
            Try again
          </Button>
        </div>
      )
    }

    if (couponsQuery.data.length === 0) {
      return (
        <EmptyStateCard
          icon={Ticket}
          title="No coupons yet"
          description="Create a coupon code that customers can use for a discount."
          action={
            <Button variant="secondary" icon={Plus} onClick={openCreateModal}>
              Create Your First Coupon
            </Button>
          }
          className="mt-8"
        />
      )
    }

    return (
      <div className="mt-8">
        <CouponsTable coupons={couponsQuery.data} onEdit={openEditModal} />
      </div>
    )
  }

  return (
    <>
      <PageHeader
        title="All Coupons"
        description="Discount codes customers can use at checkout."
        actions={
          <Button icon={Plus} onClick={openCreateModal}>
            Create coupon
          </Button>
        }
      />

      {successMessage && (
        <Alert variant="success" title={successMessage} onDismiss={() => setSuccessMessage(null)} className="mt-6" />
      )}

      {renderStats()}

      {renderCoupons()}

      <CouponModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        couponToEdit={couponToEdit}
        onSaved={handleCouponSaved}
      />
    </>
  )
}
