import type { BookingExtras, JourneyDetails } from '../types/journey'
import type { QuoteRequest } from '../types/publicApi'

export const NO_EXTRAS: BookingExtras = {
  babySeats: 0,
  boosterSeats: 0,
  meetAndGreet: false,
  extraLuggage: 0,
  specialLuggage: 0,
  wheelchair: false,
}

// Joins the journey with the extras, coupon and vehicle into the request the server prices
export function buildQuoteRequest(
  journey: JourneyDetails,
  extras: BookingExtras,
  couponCode: string,
  vehicleId: string,
): QuoteRequest {
  return {
    tripType: journey.tripType,
    pickup: journey.pickup,
    via: journey.via,
    dropoff: journey.dropoff,
    pickupDate: journey.pickupDate,
    pickupTime: journey.pickupTime,
    returnDate: journey.returnDate,
    returnTime: journey.returnTime,
    hourlyDuration: journey.hourlyDuration,
    passengers: journey.passengers,
    extras: extras,
    couponCode: couponCode,
    vehicleId: vehicleId,
  }
}
