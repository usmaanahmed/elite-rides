import type { NewFixedPrice } from '../types/fixedPrice'

// Saves a new fixed-price route.
// TODO: replace the fake delay with the real request once the backend endpoint exists, e.g.
//   await axios.post('/fixed-prices', fixedPrice)
export function addFixedPrice(fixedPrice: NewFixedPrice): Promise<NewFixedPrice> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(fixedPrice), 800)
  })
}
