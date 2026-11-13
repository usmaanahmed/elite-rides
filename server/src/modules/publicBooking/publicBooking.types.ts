// Website (customer) ke liye public APIs ke TypeScript types.
// Yahan sirf woh fields hain jo customer ko dikhane mein koi harj nahi (koi charges/internal settings nahi)
import { DiscountType } from "../setting/setting.types.js";

export interface PublicSettingsResponse {
  companyName: string;
  currency: string;
  maxPassengers: number;
  // false ho to "By the hour" tab website par nahi dikhta
  hourlyRateStatus: boolean;
  // false ho to bina login booking nahi ho sakti (customer accounts Phase 12 me)
  guestLogin: boolean;
  // true ho to booking ek quote request hai, admin approve karega
  isQuotation: boolean;
  // Admin ne "Show card payment" on kiya ho to customer booking kar sakta hai
  cardPaymentAvailable: boolean;
  extraPrices: {
    babySeatPrice: number;
    boosterSeatPrice: number;
    meetAndGreetPrice: number;
    luggagePrice: number;
    specialLuggagePrice: number;
    wheelchairPrice: number;
    petPrice: number;
  };
  // Sirf dikhane ke liye kata hua (crossed-out) price
  pretendDiscountType: DiscountType;
  pretendDiscountValue: number;
  // Booking ke baad customer ko yahan bhejna hai ("" = hamara apna thank-you page)
  bookingSuccessRedirectUrl: string;
}

export interface PublicVehicleResponse {
  id: string;
  name: string;
  description: string;
  passengerCapacity: number;
  luggageCapacity: number;
  handLuggageCapacity: number;
  imageUrl: string;
}

export interface PublicDropdownAddressResponse {
  address: string;
  type: "address" | "airport" | "station";
}

// Booking ke baad customer ko wapas jaane wali summary (thank-you page ke liye)
export interface PublicBookingResponse {
  bookingNumber: string;
  status: string;
  customerName: string;
  tripType: string;
  pickup: string;
  via: string[];
  dropoff: string;
  pickupDate: string;
  pickupTime: string;
  returnDate: string;
  returnTime: string;
  hourlyDuration: number;
  passengers: number;
  luggage: number;
  vehicleName: string;
  distanceMiles: number;
  flightNo: string;
  arrivalFrom: string;
  priceLines: { label: string; amount: number }[];
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  amountPaid: number;
  balanceDue: number;
  currency: string;
}
