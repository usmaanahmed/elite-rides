import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { ROUTES } from '../../../shared/constants/routes'
import { DateField } from '../../booking/components/DateField'
import { SubmitButton } from '../../booking/components/SubmitButton'
import { TimeField } from '../../booking/components/TimeField'
import { getDefaultPickupTime } from '../../booking/utils/getDefaultPickupTime'
import { getTodayDateString } from '../../booking/utils/getTodayDateString'
import { tourScheduleSchema, type TourScheduleValues } from '../schemas/tourScheduleSchema'
import type { PublicTour, TourBookingDraft } from '../types/tour'
import { loadTourDraft, saveTourDraft } from '../utils/tourDraftStorage'
import { TourVehicleOption } from './TourVehicleOption'

type TourScheduleFormProps = {
  tour: PublicTour
}

// Starting values: what the customer chose before (when they come back to change it), or a pickup in two hours
function buildDefaultValues(tour: PublicTour): TourScheduleValues {
  const draft = loadTourDraft()
  if (draft && draft.tourId === tour.id) {
    // Only use the saved vehicle if the tour still offers it
    const stillOffered = tour.vehicles.some((vehicle) => vehicle.vehicleId === draft.vehicleId)
    if (stillOffered) {
      return {
        vehicleId: draft.vehicleId,
        tourDate: draft.tourDate,
        pickupHour: draft.pickupTime.slice(0, 2),
        pickupMinute: draft.pickupTime.slice(3, 5),
      }
    }
  }

  const defaultTime = getDefaultPickupTime()
  return {
    vehicleId: '',
    tourDate: defaultTime.date,
    pickupHour: defaultTime.hour,
    pickupMinute: defaultTime.minute,
  }
}

// Step 1 of a tour booking, on the tour page: choose the vehicle (each has the tour price),
// then the tour date and pickup time. "Continue" saves the choice and opens the details page.
export function TourScheduleForm({ tour }: TourScheduleFormProps) {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TourScheduleValues>({
    resolver: zodResolver(tourScheduleSchema),
    defaultValues: buildDefaultValues(tour),
    mode: 'onTouched',
  })

  function continueToDetails(values: TourScheduleValues): void {
    const draft: TourBookingDraft = {
      tourId: tour.id,
      vehicleId: values.vehicleId,
      tourDate: values.tourDate,
      pickupTime: `${values.pickupHour}:${values.pickupMinute}`,
    }
    saveTourDraft(draft)
    navigate(ROUTES.tourBooking)
  }

  return (
    <form onSubmit={handleSubmit(continueToDetails)} noValidate id="book-tour" className="scroll-mt-8">
      <div className="grid items-start gap-12 lg:grid-cols-[1fr_380px] lg:gap-16 xl:gap-24">
        <div className="min-w-0 space-y-12">
          <section aria-labelledby="tour-about-heading">
            <h2 id="tour-about-heading" className="text-2xl font-semibold tracking-tight text-white">
              About this tour
            </h2>
            {tour.description ? (
              <p className="mt-4 whitespace-pre-line text-base leading-relaxed text-white/70">{tour.description}</p>
            ) : (
              <p className="mt-4 text-base text-white/50">Call us to find out more about this tour.</p>
            )}
          </section>

          <section aria-labelledby="tour-vehicles-heading">
            <h2 id="tour-vehicles-heading" className="text-2xl font-semibold tracking-tight text-white">
              Choose your vehicle
            </h2>
            <div className="mt-5 space-y-3">
              {tour.vehicles.map((vehicle) => (
                <TourVehicleOption key={vehicle.vehicleId} vehicle={vehicle} field={register('vehicleId')} />
              ))}
            </div>
            {errors.vehicleId?.message && (
              <p className="mt-3 text-sm font-medium text-danger">{errors.vehicleId.message}</p>
            )}
          </section>
        </div>

        <aside className="lg:sticky lg:top-8">
          <div className="rounded-3xl bg-surface p-5 text-ink sm:p-6">
            <h2 className="text-lg font-semibold">When do you want to go?</h2>
            <div className="mt-4 space-y-3">
              <DateField
                id="tour-date"
                label="Tour date"
                min={getTodayDateString()}
                error={errors.tourDate?.message}
                {...register('tourDate')}
              />
              <TimeField
                id="tour-pickup-time"
                label="Pickup time"
                hourField={register('pickupHour')}
                minuteField={register('pickupMinute')}
                error={errors.pickupHour?.message}
              />
              <SubmitButton label="Continue" />
            </div>
            <p className="mt-4 text-center text-xs text-muted">Next: your details and payment. No charge yet.</p>
          </div>
        </aside>
      </div>
    </form>
  )
}
