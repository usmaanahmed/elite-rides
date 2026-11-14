// Payment (Stripe) module ke TypeScript types

// Stripe checkout page banane ke liye booking ki zaroori details
export interface CheckoutBookingInfo {
  bookingId: string;
  bookingNumber: string;
  // Thank-you link ka secret code (payment ke baad customer wapas isi page par aata hai)
  accessToken: string;
  customerEmail: string;
  // Kitne paise lene hain (pounds me, e.g. 59.5)
  amount: number;
}
