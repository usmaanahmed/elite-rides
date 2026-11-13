// Fare calculator ke tests. Chalane ke liye: npm test
// Docs ki examples yahan wahi numbers dete hain jo docs me likhe hain.
import assert from "node:assert/strict";
import { test } from "node:test";
import { extractPostcode } from "../../utils/extractPostcode.js";
import { isTimeInWindow } from "../../utils/isTimeInWindow.js";
import { roundMoney } from "../../utils/roundMoney.js";
import { ExtrasSettings } from "../setting/setting.types.js";
import { addUpLines, calculateDiscount, calculateDistanceFare, calculateExtraLines, calculatePremium, VehicleRates } from "./quote.calculator.js";

// Docs ke test bands: 1–20 £2.50 · 20–50 £2.30 · 50–100 £2.00 · 100–500 £1.80
const testBands = [
  { fromMiles: 1, toMiles: 20, ratePerMile: 2.5 },
  { fromMiles: 20, toMiles: 50, ratePerMile: 2.3 },
  { fromMiles: 50, toMiles: 100, ratePerMile: 2 },
  { fromMiles: 100, toMiles: 500, ratePerMile: 1.8 },
];

function makeRates(fixedPrice: number): VehicleRates {
  return { rateType: "mileage", fixedPrice: fixedPrice, mileageBands: testBands, slabBands: [] };
}

const extraPrices: ExtrasSettings = {
  babySeatPrice: 5,
  boosterSeatPrice: 5,
  meetAndGreetPrice: 5,
  luggagePrice: 3,
  specialLuggagePrice: 10,
  wheelchairPrice: 0,
  returnExtraPrice: 0,
  waitingPricePer5Minutes: 0,
  viaPrice: 0,
};

const noExtras = { babySeats: 0, boosterSeats: 0, meetAndGreet: false, extraLuggage: 0, specialLuggage: 0, wheelchair: false };

// Distance fare + vehicle fixed price = base fare (premium isi par lagta hai)
function baseFare(miles: number, fixedPrice: number): number {
  const distanceFare = calculateDistanceFare(makeRates(fixedPrice), miles) ?? 0;
  return roundMoney(distanceFare + fixedPrice);
}

test("Example 1: Saloon 10 mi, din = £27.00", () => {
  const base = baseFare(10, 2);
  assert.equal(base, 27);
  assert.equal(calculatePremium(base, { type: "percent", value: 0 }), 0);
});

test("Example 2: Executive 25 mi, Heathrow T2 dropoff = £96.25", () => {
  const base = baseFare(25, 2);
  assert.equal(base, 59.5);
  const premium = calculatePremium(base, { type: "percent", value: 50 });
  assert.equal(premium, 29.75);
  assert.equal(roundMoney(base + premium + 7), 96.25);
});

test("Example 3: People Carrier 15 mi, raat, baby seat, meet & greet = £62.40", () => {
  const base = baseFare(15, 2);
  assert.equal(base, 39.5);
  const premium = calculatePremium(base, { type: "percent", value: 20 });
  assert.equal(premium, 7.9);
  const extraLines = calculateExtraLines({ ...noExtras, babySeats: 1, meetAndGreet: true }, extraPrices);
  assert.equal(addUpLines(extraLines), 10);
  const nightSurcharge = 5;
  assert.equal(roundMoney(base + premium + nightSurcharge + addUpLines(extraLines)), 62.4);
});

test("Example 4: 8 Seater Mini Bus 30 mi, Stansted pickup, Christmas = £129.40", () => {
  const base = baseFare(30, 2);
  assert.equal(base, 71);
  const premium = calculatePremium(base, { type: "percent", value: 40 });
  assert.equal(premium, 28.4);
  assert.equal(roundMoney(base + premium + 10 + 20), 129.4);
});

test("Example 5: Coupon SAVE10 (10%) on £89.25 = £80.32", () => {
  const discount = calculateDiscount(89.25, "percent", 10);
  assert.equal(discount, 8.93);
  assert.equal(roundMoney(89.25 - discount), 80.32);
});

test("Example 6: Coupon FIRST5 (£5) on £27.00 = £22.00", () => {
  const discount = calculateDiscount(27, "fixed", 5);
  assert.equal(roundMoney(27 - discount), 22);
});

test("Example 7: Saloon 10 mi, raat (£5 night) = £32.00", () => {
  assert.equal(roundMoney(baseFare(10, 2) + 5), 32);
});

test("Mileage bands: 20 mile pehle band me, 1 mile se kam bhi pehle band me", () => {
  assert.equal(calculateDistanceFare(makeRates(0), 20), 50);
  assert.equal(calculateDistanceFare(makeRates(0), 0.5), 1.25);
});

test("Mileage bands: aakhri band se zyada miles par aakhri band ka rate", () => {
  assert.equal(calculateDistanceFare(makeRates(0), 600), 1080);
});

test("Slab rates: flat price, per-mile nahi", () => {
  const slabRates: VehicleRates = {
    rateType: "slab",
    fixedPrice: 0,
    mileageBands: [],
    slabBands: [
      { fromMiles: 1, toMiles: 20, price: 50 },
      { fromMiles: 20, toMiles: 50, price: 90 },
    ],
  };
  assert.equal(calculateDistanceFare(slabRates, 12), 50);
  assert.equal(calculateDistanceFare(slabRates, 35), 90);
});

test("Rates set na hon to distance fare null", () => {
  assert.equal(calculateDistanceFare({ rateType: "mileage", fixedPrice: 0, mileageBands: [], slabBands: [] }, 10), null);
});

test("Fixed premium flat pounds hota hai", () => {
  assert.equal(calculatePremium(100, { type: "fixed", value: 12.5 }), 12.5);
});

test("Discount total se zyada nahi ho sakta", () => {
  assert.equal(calculateDiscount(20, "fixed", 50), 20);
  assert.equal(calculateDiscount(20, "none", 50), 0);
});

test("Extras: luggage aur special luggage per item", () => {
  const lines = calculateExtraLines({ ...noExtras, extraLuggage: 2, specialLuggage: 1 }, extraPrices);
  assert.equal(addUpLines(lines), 16);
});

test("isTimeInWindow: raat ki window midnight cross karti hai", () => {
  assert.equal(isTimeInWindow("23:00", "22:00", "06:00"), true);
  assert.equal(isTimeInWindow("05:59", "22:00", "06:00"), true);
  assert.equal(isTimeInWindow("06:00", "22:00", "06:00"), false);
  assert.equal(isTimeInWindow("12:00", "22:00", "06:00"), false);
});

test("extractPostcode: address me se postcode", () => {
  assert.equal(extractPostcode("Heathrow Airport, Longford TW6 1EW"), "TW61EW");
  assert.equal(extractPostcode("10 Downing Street, London sw1a 2aa"), "SW1A2AA");
  assert.equal(extractPostcode("Somewhere with no code"), "");
});
