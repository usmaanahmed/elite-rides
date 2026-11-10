import type { HourlyFormValues } from '../schemas/hourlyFormSchema'
import type { TransferFormValues } from '../schemas/transferFormSchema'
import type { JourneyDetails } from '../types/journey'

// Turns the "Transfer" tab's values into a journey for the server
export function buildTransferJourney(values: TransferFormValues): JourneyDetails {
  const via: string[] = []
  for (const stop of values.stops) {
    via.push(stop.address.trim())
  }

  let tripType: JourneyDetails['tripType'] = 'one_way'
  let returnDate = ''
  let returnTime = ''
  if (values.hasReturn) {
    tripType = 'return'
    returnDate = values.returnDate
    returnTime = `${values.returnHour}:${values.returnMinute}`
  }

  return {
    tripType: tripType,
    pickup: values.pickup.trim(),
    via: via,
    dropoff: values.dropoff.trim(),
    pickupDate: values.pickupDate,
    pickupTime: `${values.pickupHour}:${values.pickupMinute}`,
    returnDate: returnDate,
    returnTime: returnTime,
    hourlyDuration: 0,
    passengers: Number(values.passengers),
    luggage: Number(values.luggage),
  }
}

// Turns the "By the hour" tab's values into a journey for the server
export function buildHourlyJourney(values: HourlyFormValues): JourneyDetails {
  return {
    tripType: 'hourly',
    pickup: values.pickup.trim(),
    via: [],
    dropoff: '',
    pickupDate: values.pickupDate,
    pickupTime: `${values.pickupHour}:${values.pickupMinute}`,
    returnDate: '',
    returnTime: '',
    hourlyDuration: Number(values.hours),
    passengers: Number(values.passengers),
    luggage: Number(values.luggage),
  }
}
