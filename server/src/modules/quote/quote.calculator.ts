// Fare ka hisab kitab: sirf simple functions, koi database ya network nahi.
// Isi liye inhe test karna aasaan hai (quote.calculator.test.ts)
import { roundMoney } from "../../utils/roundMoney.js";
import { ExtrasSettings } from "../setting/setting.types.js";
import { CalculationFormat, MileageBand, SlabBand } from "../vehicle/vehicle.types.js";
import { QuoteExtras, QuoteLine } from "./quote.types.js";

// Vehicle ke rates ka woh hissa jo distance fare ke liye chahiye
export interface VehicleRates {
  rateType: "mileage" | "slab";
  fixedPrice: number;
  mileageBands: MileageBand[];
  slabBands: SlabBand[];
}

// Miles ke liye sahi band ka index dhoondta hai.
// Bands ko fromMiles se sort karke pehla band lete hain jis me miles <= toMiles ho.
// Aakhri band se zyada miles hon to aakhri band hi use hota hai.
function findBandIndex(sortedBands: { toMiles: number }[], miles: number): number {
  for (let index = 0; index < sortedBands.length; index++) {
    if (miles <= sortedBands[index].toMiles) {
      return index;
    }
  }
  return sortedBands.length - 1;
}

// Sirf miles wala hissa: mileage band me miles × rate, ya slab band ki flat price.
// Vehicle ka fixedPrice (base fare) is me shamil nahi. Rates set na hon to null.
export function calculateDistanceFare(rates: VehicleRates, miles: number): number | null {
  if (rates.rateType === "slab") {
    if (rates.slabBands.length === 0) {
      return null;
    }
    const sortedSlabs = [...rates.slabBands].sort((a, b) => a.fromMiles - b.fromMiles);
    const slab = sortedSlabs[findBandIndex(sortedSlabs, miles)];
    return roundMoney(slab.price);
  }

  if (rates.mileageBands.length === 0) {
    return null;
  }
  const sortedBands = [...rates.mileageBands].sort((a, b) => a.fromMiles - b.fromMiles);
  const band = sortedBands[findBandIndex(sortedBands, miles)];
  return roundMoney(miles * band.ratePerMile);
}

// Calculation Format premium: percent = base fare ka %, fixed = flat pounds
export function calculatePremium(baseFare: number, format: CalculationFormat): number {
  if (format.type === "percent") {
    return roundMoney((baseFare * format.value) / 100);
  }
  return roundMoney(format.value);
}

// Extras ki lines (0 amount wali lines nahi banti)
export function calculateExtraLines(extras: QuoteExtras, prices: ExtrasSettings): QuoteLine[] {
  const lines: QuoteLine[] = [];

  if (extras.babySeats > 0) {
    lines.push({ label: `Baby seat × ${extras.babySeats}`, amount: roundMoney(extras.babySeats * prices.babySeatPrice) });
  }
  if (extras.boosterSeats > 0) {
    lines.push({ label: `Booster seat × ${extras.boosterSeats}`, amount: roundMoney(extras.boosterSeats * prices.boosterSeatPrice) });
  }
  if (extras.meetAndGreet) {
    lines.push({ label: "Meet & greet", amount: roundMoney(prices.meetAndGreetPrice) });
  }
  if (extras.extraLuggage > 0) {
    lines.push({ label: `Extra luggage × ${extras.extraLuggage}`, amount: roundMoney(extras.extraLuggage * prices.luggagePrice) });
  }
  if (extras.specialLuggage > 0) {
    lines.push({
      label: `Special luggage × ${extras.specialLuggage}`,
      amount: roundMoney(extras.specialLuggage * prices.specialLuggagePrice),
    });
  }
  if (extras.wheelchair) {
    lines.push({ label: "Wheelchair", amount: roundMoney(prices.wheelchairPrice) });
  }
  if (extras.pet) {
    lines.push({ label: "Pet", amount: roundMoney(prices.petPrice) });
  }

  return lines.filter((line) => line.amount !== 0);
}

// Discount (global ya coupon) ki amount. Total se zyada kabhi nahi hoti
export function calculateDiscount(total: number, type: "none" | "fixed" | "percent", value: number): number {
  if (type === "none" || value <= 0) {
    return 0;
  }

  let discount = value;
  if (type === "percent") {
    discount = (total * value) / 100;
  }

  discount = roundMoney(discount);
  if (discount > total) {
    return roundMoney(total);
  }
  return discount;
}

// Lines ki amounts ka total
export function addUpLines(lines: QuoteLine[]): number {
  let total = 0;
  for (const line of lines) {
    total = total + line.amount;
  }
  return roundMoney(total);
}

// Round off on ho to nearest whole pound
export function roundToWholePound(amount: number): number {
  return Math.round(amount);
}
