// The values exactly as they sit in the Ban Address form
export type BanAddressFormValues = {
  address: string
}

// A banned address ready to be sent to the server
export type NewBanAddress = {
  // Trimmed, e.g. "221B Baker Street, London NW1 6XE"
  address: string
}
