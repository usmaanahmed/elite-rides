// Website (customer) ke liye business logic. Yeh module doosre modules ki services hi use karta hai
import { AppError } from "../../utils/AppError.js";
import { createBooking } from "../booking/booking.service.js";
import { CreateBookingInput } from "../booking/booking.types.js";
import { getAllDropdownAddresses } from "../dropdownAddress/dropdownAddress.service.js";
import { createQuote } from "../quote/quote.service.js";
import { QuoteInput, QuoteResponse } from "../quote/quote.types.js";
import { getSettings } from "../setting/setting.service.js";
import { getAllVehicles } from "../vehicle/vehicle.service.js";
import {
  PublicBookingResponse,
  PublicDropdownAddressResponse,
  PublicSettingsResponse,
  PublicVehicleResponse,
} from "./publicBooking.types.js";

// Server ke waqt ke hisaab se "YYYY-MM-DD HH:mm" (pickup time se compare karne ke liye)
function getNowText(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

// Guzra hua pickup time customer se nahi liya ja sakta
function checkPickupIsInFuture(pickupDate: string, pickupTime: string) {
  const pickupText = pickupDate + " " + pickupTime;
  if (pickupText <= getNowText()) {
    throw new AppError("The pickup time has already passed. Please choose a later time.", 400);
  }
}

export async function getPublicSettings(): Promise<PublicSettingsResponse> {
  const settings = await getSettings();

  return {
    companyName: settings.office.companyName,
    currency: settings.office.currency,
    maxPassengers: settings.general.maxPassengers,
    hourlyRateStatus: settings.general.hourlyRateStatus,
    guestLogin: settings.general.guestLogin,
    isQuotation: settings.general.isQuotation,
    // Real Stripe payment Phase 13 me aayegi. Tab tak booking pending rehti hai
    cardPaymentAvailable: settings.pricing.showCard,
    extraPrices: {
      babySeatPrice: settings.extras.babySeatPrice,
      boosterSeatPrice: settings.extras.boosterSeatPrice,
      meetAndGreetPrice: settings.extras.meetAndGreetPrice,
      luggagePrice: settings.extras.luggagePrice,
      specialLuggagePrice: settings.extras.specialLuggagePrice,
      wheelchairPrice: settings.extras.wheelchairPrice,
      petPrice: settings.extras.petPrice,
    },
    pretendDiscountType: settings.discount.pretendDiscountType,
    pretendDiscountValue: settings.discount.pretendDiscountValue,
    bookingSuccessRedirectUrl: settings.general.bookingSuccessRedirectUrl,
  };
}

// Vehicles bina rates/premium ke (woh sirf server ko pata hone chahiye)
export async function getPublicVehicles(): Promise<PublicVehicleResponse[]> {
  const vehicles = await getAllVehicles();
  return vehicles.map((vehicle) => ({
    id: vehicle.id,
    name: vehicle.name,
    description: vehicle.description,
    passengerCapacity: vehicle.passengerCapacity,
    luggageCapacity: vehicle.luggageCapacity,
    handLuggageCapacity: vehicle.handLuggageCapacity,
    imageUrl: vehicle.imageUrl,
  }));
}

// Airports / stations ki list (booking form ke suggestions ke liye), bina charges ke
export async function getPublicDropdownAddresses(): Promise<PublicDropdownAddressResponse[]> {
  const addresses = await getAllDropdownAddresses();
  return addresses.map((address) => ({ address: address.address, type: address.type }));
}

export async function getPublicQuote(input: QuoteInput): Promise<QuoteResponse> {
  checkPickupIsInFuture(input.pickupDate, input.pickupTime);
  return createQuote(input);
}

// Customer ki booking. Price server khud nikalta hai (createBooking ke andar)
export async function createPublicBooking(input: CreateBookingInput): Promise<PublicBookingResponse> {
  const settings = await getSettings();

  if (!settings.general.guestLogin) {
    throw new AppError("Please log in to make a booking", 403);
  }
  // Website se sirf card payment hoti hai (pay in car hata diya gaya hai)
  if (input.paymentMethod !== "pay_card") {
    throw new AppError("Please choose card payment.", 400);
  }
  if (!settings.pricing.showCard) {
    throw new AppError("Online booking is not available right now. Please call us to book.", 400);
  }

  checkPickupIsInFuture(input.quote.pickupDate, input.quote.pickupTime);

  // Bags gaari me aane chahiye (passengers ki check quote khud karta hai)
  const vehicles = await getAllVehicles();
  const chosenVehicle = vehicles.find((vehicle) => vehicle.id === input.vehicleId);
  if (chosenVehicle && input.luggage > chosenVehicle.luggageCapacity) {
    throw new AppError(`This vehicle takes up to ${chosenVehicle.luggageCapacity} large bags. Please choose a bigger vehicle.`, 400);
  }

  // Website se aane wali booking kisi account se judi nahi hoti (customer accounts Phase 12 me)
  const booking = await createBooking({
    ...input,
    customer: { ...input.customer, customerId: "" },
  });

  return {
    bookingNumber: booking.bookingNumber,
    status: booking.status,
    customerName: booking.customer.name,
    tripType: booking.tripType,
    pickup: booking.pickup,
    via: booking.via,
    dropoff: booking.dropoff,
    pickupDate: booking.pickupDate,
    pickupTime: booking.pickupTime,
    returnDate: booking.returnDate,
    returnTime: booking.returnTime,
    hourlyDuration: booking.hourlyDuration,
    passengers: booking.passengers,
    luggage: booking.luggage,
    vehicleName: booking.vehicleName,
    distanceMiles: booking.distanceMiles,
    flightNo: booking.flightNo,
    arrivalFrom: booking.arrivalFrom,
    priceLines: booking.priceLines,
    total: booking.total,
    paymentMethod: booking.paymentMethod,
    paymentStatus: booking.paymentStatus,
    amountPaid: booking.amountPaid,
    balanceDue: booking.balanceDue,
    currency: settings.office.currency,
  };
}
