import type { RateType, Vehicle } from '../types/vehicle'

// 1.8 -> "£1.80"
function formatPoundsAndPence(value: number): string {
  return `£${value.toFixed(2)}`
}

// 1 -> "1 band", 3 -> "3 bands"
function getBandCountText(bandCount: number): string {
  if (bandCount === 1) {
    return '1 band'
  }
  return `${bandCount} bands`
}

// A short line about how a vehicle is priced by distance, for its card and table row,
// e.g. "From £1.80/mile · 3 bands" or "From £50 · 2 slab bands".
// rateType comes from the "Mileage by slabs" setting (it is the same for every vehicle).
// Gives back null when no rates have been saved for the vehicle yet.
export function getRateText(vehicle: Vehicle, rateType: RateType): string | null {
  if (rateType === 'slab') {
    if (vehicle.slabBands.length === 0) {
      return null
    }
    const slabPrices = vehicle.slabBands.map((band) => band.price)
    const cheapestPrice = Math.min(...slabPrices)
    return `From ${formatPoundsAndPence(cheapestPrice)} · ${getBandCountText(vehicle.slabBands.length)}`
  }

  if (vehicle.mileageBands.length === 0) {
    return null
  }
  const ratesPerMile = vehicle.mileageBands.map((band) => band.ratePerMile)
  const cheapestRate = Math.min(...ratesPerMile)
  return `From ${formatPoundsAndPence(cheapestRate)}/mile · ${getBandCountText(vehicle.mileageBands.length)}`
}
