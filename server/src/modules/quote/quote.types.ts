// Quote (fare engine) module ke TypeScript types

export type TripType = "one_way" | "return" | "hourly";

// Customer ke chune hue extras
export interface QuoteExtras {
  // Kitni baby seats / booster seats chahiye (price per seat)
  babySeats: number;
  boosterSeats: number;
  meetAndGreet: boolean;
  // Extra luggage items aur special luggage items ki tadaad
  extraLuggage: number;
  specialLuggage: number;
  wheelchair: boolean;
  pet: boolean;
}

// Quote mangne wali request (validation ke baad)
export interface QuoteInput {
  tripType: TripType;
  pickup: string;
  // Beech ke stops (khaali ho sakta hai)
  via: string[];
  // Hourly hire me khaali ho sakta hai
  dropoff: string;
  // "YYYY-MM-DD" aur "HH:mm"
  pickupDate: string;
  pickupTime: string;
  // Sirf return trip me
  returnDate: string;
  returnTime: string;
  // Sirf hourly hire me (ghantay)
  hourlyDuration: number;
  passengers: number;
  extras: QuoteExtras;
  // Khaali = coupon nahi
  couponCode: string;
  // Khaali = saari vehicles ka quote
  vehicleId: string;
}

// Price breakdown ki ek line. Discount ki amount negative hoti hai
export interface QuoteLine {
  label: string;
  amount: number;
}

// Ek vehicle ka quote
export interface VehicleQuote {
  vehicleId: string;
  vehicleName: string;
  // false ho to is vehicle ka price nahi, unavailableReason me wajah hoti hai
  available: boolean;
  unavailableReason: string;
  lines: QuoteLine[];
  total: number;
  // Coupon se kitna discount mila (booking me snapshot ke liye). Coupon na ho to 0
  couponDiscount: number;
}

export interface QuoteResponse {
  tripType: TripType;
  // Pickup se dropoff tak (via ke saath) miles. Hourly hire me 0
  distanceMiles: number;
  currency: string;
  // Lagaya gaya coupon code, nahi to ""
  couponCode: string;
  vehicles: VehicleQuote[];
}

// Ek journey ke address-related charges (pickup/dropoff/congestion)
export interface LocationCharges {
  pickupCharge: number;
  dropoffCharge: number;
  congestionCharge: number;
}
