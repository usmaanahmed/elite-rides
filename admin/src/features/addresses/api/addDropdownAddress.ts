import type { NewDropdownAddress } from '../types/dropdownAddress'

// Saves a new drop down address.
// TODO: replace the fake delay with the real request once the backend endpoint exists, e.g.
//   await axios.post('/dropdown-addresses', address)
export function addDropdownAddress(address: NewDropdownAddress): Promise<NewDropdownAddress> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(address), 800)
  })
}
