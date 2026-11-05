import type { NewSurchargeAddress } from '../types/surchargeAddress'

// Saves a new surcharge address.
// TODO: replace the fake delay with the real request once the backend endpoint exists, e.g.
//   await axios.post('/surcharge-addresses', surchargeAddress)
export function addSurchargeAddress(surchargeAddress: NewSurchargeAddress): Promise<NewSurchargeAddress> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(surchargeAddress), 800)
  })
}
