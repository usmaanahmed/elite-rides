// The values exactly as they sit in the Congestion Address form (the price stays text while typing)
export type CongestionAddressFormValues = {
  postcode: string
  price: string
}

// A congestion address ready to be sent to the server
export type NewCongestionAddress = {
  // Postcode start, e.g. "EC1" or "WC2"
  postcode: string
  // Extra charge in pounds
  price: number
}

// A congestion address as saved on the server
export type CongestionAddress = {
  id: string
  postcode: string
  price: number
}
