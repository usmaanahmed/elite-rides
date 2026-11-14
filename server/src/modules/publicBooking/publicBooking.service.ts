// Website (customer) ke liye business logic. Yeh module doosre modules ki services hi use karta hai
import { AppError } from "../../utils/AppError.js";
import { createBooking, getBookingByAccessToken } from "../booking/booking.service.js";
import { BookingResponse, CreateBookingInput } from "../booking/booking.types.js";
import { getAllDropdownAddresses } from "../dropdownAddress/dropdownAddress.service.js";
import { createCheckoutSession, isCardPaymentReady } from "../payment/payment.service.js";
import { createQuote } from "../quote/quote.service.js";
import { QuoteInput, QuoteResponse } from "../quote/quote.types.js";
import { getSettings } from "../setting/setting.service.js";
import { SettingsResponse } from "../setting/setting.types.js";
import { getAllVehicles } from "../vehicle/vehicle.service.js";
import {
  CardCheckoutResponse,
  CreatePublicBookingResponse,
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

// Admin ne "Show card payment" on kiya ho AUR Stripe keys .env me hon, tab hi card payment
function isCardPaymentOn(settings: SettingsResponse): boolean {
  return settings.pricing.showCard && isCardPaymentReady();
}

// true ho to customer abhi card se pay kar sakta hai (e.g. Stripe page band kar diya tha, ya quote approve ho gaya)
function canPayByCard(booking: BookingResponse, settings: SettingsResponse): boolean {
  if (!isCardPaymentOn(settings)) {
    return false;
  }
  if (booking.paymentMethod !== "pay_card" || booking.balanceDue <= 0) {
    return false;
  }
  // Quote request ki payment admin ke approve karne ke baad hoti hai. Cancelled / completed par payment nahi
  return booking.status === "pending" || booking.status === "confirmed";
}

// Booking ka woh hissa jo customer ko dikhana theek hai (email/phone nahi, internal fields nahi)
function toPublicBooking(booking: BookingResponse, settings: SettingsResponse): PublicBookingResponse {
  return {
    reference: booking.accessToken,
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
    canPayByCard: canPayByCard(booking, settings),
  };
}

// Booking ki baqi raqam ke liye Stripe checkout page ka link
function startCheckout(booking: BookingResponse): Promise<string> {
  return createCheckoutSession({
    bookingId: booking.id,
    bookingNumber: booking.bookingNumber,
    accessToken: booking.accessToken,
    customerEmail: booking.customer.email,
    amount: booking.balanceDue,
  });
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
    cardPaymentAvailable: isCardPaymentOn(settings),
    cashPaymentAvailable: settings.pricing.showCash,
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

// Customer ki chuni hui payment admin ne on ki honi chahiye
function checkPaymentMethodIsOn(paymentMethod: string, settings: SettingsResponse) {
  if (paymentMethod === "pay_card" && !isCardPaymentOn(settings)) {
    throw new AppError("Card payment is not available right now. Please choose another way to pay.", 400);
  }
  if (paymentMethod === "pay_cash" && !settings.pricing.showCash) {
    throw new AppError("Pay in car is not available right now. Please choose another way to pay.", 400);
  }
}

// Customer ki booking. Price server khud nikalta hai (createBooking ke andar).
// Card payment ho to Stripe checkout ka link bhi wapas jata hai (customer ko wahan bhejna hai)
export async function createPublicBooking(input: CreateBookingInput): Promise<CreatePublicBookingResponse> {
  const settings = await getSettings();

  if (!settings.general.guestLogin) {
    throw new AppError("Please log in to make a booking", 403);
  }
  checkPaymentMethodIsOn(input.paymentMethod, settings);
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

  // Card booking: abhi Stripe par payment. Quote request (quotation mode) ki payment approve hone ke baad hoti hai
  let checkoutUrl = "";
  if (input.paymentMethod === "pay_card" && booking.status === "pending") {
    try {
      checkoutUrl = await startCheckout(booking);
    } catch (error) {
      // Booking save ho chuki hai. Customer thank-you page par "Pay now" se dobara try kar sakta hai
      console.log("Stripe checkout could not be started for booking " + booking.bookingNumber, error);
    }
  }

  return {
    booking: toPublicBooking(booking, settings),
    checkoutUrl: checkoutUrl,
  };
}

// GET /api/public/bookings/:reference: thank-you page ki booking (secret code se)
export async function getPublicBooking(reference: string): Promise<PublicBookingResponse> {
  const booking = await getBookingByAccessToken(reference);
  const settings = await getSettings();
  return toPublicBooking(booking, settings);
}

// POST /api/public/bookings/:reference/checkout: "Pay now" button, naya Stripe checkout page
export async function startPublicCardPayment(reference: string): Promise<CardCheckoutResponse> {
  const booking = await getBookingByAccessToken(reference);
  const settings = await getSettings();

  if (!canPayByCard(booking, settings)) {
    throw new AppError("This booking does not need a card payment.", 400);
  }

  const checkoutUrl = await startCheckout(booking);
  return { checkoutUrl: checkoutUrl };
}
