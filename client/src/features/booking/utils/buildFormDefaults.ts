import type { HourlyFormValues } from '../schemas/hourlyFormSchema'
import type { TransferFormValues } from '../schemas/transferFormSchema'
import type { JourneyDetails } from '../types/journey'
import { getDefaultPickupTime } from './getDefaultPickupTime'

// "14:30" -> { hour: "14", minute: "30" }
function splitTime(time: string): { hour: string; minute: string } {
  const [hour, minute] = time.split(':')
  return { hour: hour, minute: minute }
}

// Starting values of the Transfer form: the saved journey (when coming back to change it) or empty
export function buildTransferDefaults(savedJourney: JourneyDetails | null): TransferFormValues {
  const defaultPickupTime = getDefaultPickupTime()

  if (!savedJourney || savedJourney.tripType === 'hourly') {
    return {
      pickup: '',
      stops: [],
      dropoff: '',
      pickupDate: defaultPickupTime.date,
      pickupHour: defaultPickupTime.hour,
      pickupMinute: defaultPickupTime.minute,
      passengers: '1',
      luggage: '0',
      hasReturn: false,
      returnDate: '',
      returnHour: '12',
      returnMinute: '00',
    }
  }

  const pickupTime = splitTime(savedJourney.pickupTime)
  const hasReturn = savedJourney.tripType === 'return'
  let returnTime = { hour: '12', minute: '00' }
  if (hasReturn) {
    returnTime = splitTime(savedJourney.returnTime)
  }

  return {
    pickup: savedJourney.pickup,
    stops: savedJourney.via.map((stop) => ({ address: stop })),
    dropoff: savedJourney.dropoff,
    pickupDate: savedJourney.pickupDate,
    pickupHour: pickupTime.hour,
    pickupMinute: pickupTime.minute,
    passengers: String(savedJourney.passengers),
    luggage: String(savedJourney.luggage),
    hasReturn: hasReturn,
    returnDate: savedJourney.returnDate,
    returnHour: returnTime.hour,
    returnMinute: returnTime.minute,
  }
}

// Starting values of the "By the hour" form: the saved hourly journey or empty
export function buildHourlyDefaults(savedJourney: JourneyDetails | null): HourlyFormValues {
  const defaultPickupTime = getDefaultPickupTime()

  if (!savedJourney || savedJourney.tripType !== 'hourly') {
    return {
      pickup: '',
      hours: '2',
      pickupDate: defaultPickupTime.date,
      pickupHour: defaultPickupTime.hour,
      pickupMinute: defaultPickupTime.minute,
      passengers: '1',
      luggage: '0',
    }
  }

  const pickupTime = splitTime(savedJourney.pickupTime)
  return {
    pickup: savedJourney.pickup,
    hours: String(savedJourney.hourlyDuration),
    pickupDate: savedJourney.pickupDate,
    pickupHour: pickupTime.hour,
    pickupMinute: pickupTime.minute,
    passengers: String(savedJourney.passengers),
    luggage: String(savedJourney.luggage),
  }
}
