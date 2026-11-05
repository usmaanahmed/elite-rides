import type { NewBanAddress } from '../types/banAddress'

// Saves a new banned address.
// TODO: replace the fake delay with the real request once the backend endpoint exists, e.g.
//   await axios.post('/ban-addresses', banAddress)
export function addBanAddress(banAddress: NewBanAddress): Promise<NewBanAddress> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(banAddress), 800)
  })
}
