// Fare engine: customer ki journey ka price (breakdown ke saath) nikalta hai.
// Yeh module doosre modules ki services use karta hai (unke repository/model nahi).
import { AppError } from "../../utils/AppError.js";
import { extractPostcode } from "../../utils/extractPostcode.js";
import { isTimeInWindow } from "../../utils/isTimeInWindow.js";
import { roundMoney } from "../../utils/roundMoney.js";
import { isAddressBanned } from "../banAddress/banAddress.service.js";
import { calculateCouponDiscount, validateCoupon } from "../coupon/coupon.service.js";
import { getCongestionCharge } from "../congestionAddress/congestionAddress.service.js";
import { getDropdownAddressCharge } from "../dropdownAddress/dropdownAddress.service.js";
import { findFixedPrice } from "../fixedPrice/fixedPrice.service.js";
import { getSettings } from "../setting/setting.service.js";
import { SettingsResponse } from "../setting/setting.types.js";
import { getAddressSurchargeTotal } from "../surchargeAddress/surchargeAddress.service.js";
import { getDateSurchargeTotal } from "../surchargeDate/surchargeDate.service.js";
import { getNightSurchargeAmount } from "../surchargeNight/surchargeNight.service.js";
import { getAllVehicles } from "../vehicle/vehicle.service.js";
import { VehicleResponse } from "../vehicle/vehicle.types.js";
import {
  addUpLines,
  calculateDiscount,
  calculateDistanceFare,
  calculateExtraLines,
  calculatePremium,
  roundToWholePound,
} from "./quote.calculator.js";
import { getDistanceInMiles } from "./distance.service.js";
import { LocationCharges, QuoteInput, QuoteLine, QuoteResponse, TripType, VehicleQuote } from "./quote.types.js";

// Ek leg (jaana ya wapsi) banane ke liye zaroori cheezein
interface LegParams {
  vehicle: VehicleResponse;
  settings: SettingsResponse;
  tripType: TripType;
  pickup: string;
  dropoff: string;
  date: string;
  time: string;
  miles: number;
  hourlyDuration: number;
  location: LocationCharges;
  isReturnLeg: boolean;
  // Return trip me lines ke aage "Outbound – " ya "Return – " lagta hai
  labelPrefix: string;
}

interface LegResult {
  lines: QuoteLine[];
  // Khaali ho to leg sahi bani, warna is vehicle ka quote nahi ban sakta
  unavailableReason: string;
}

// ---------- Checks ----------

// Date blocked range ke andar hai ya nahi (dono taraf shamil)
function isDateBlocked(date: string, settings: SettingsResponse): boolean {
  const from = settings.general.blockDateFrom;
  const to = settings.general.blockDateTo;
  if (from === "" || to === "") {
    return false;
  }
  return date >= from && date <= to;
}

function isTimeBlocked(time: string, settings: SettingsResponse): boolean {
  const from = settings.general.blockTimeFrom;
  const to = settings.general.blockTimeTo;
  if (from === "" || to === "") {
    return false;
  }
  return isTimeInWindow(time, from, to);
}

function checkPickupSlot(date: string, time: string, settings: SettingsResponse, name: string) {
  if (isDateBlocked(date, settings)) {
    throw new AppError(`Bookings are not available on the ${name} date. Please choose another date.`, 400);
  }
  if (isTimeBlocked(time, settings)) {
    throw new AppError(`Bookings are not available at the ${name} time. Please choose another time.`, 400);
  }
}

// Saari checks. Koi fail ho to customer ke liye saaf error
async function runChecks(input: QuoteInput, settings: SettingsResponse) {
  if (input.tripType === "hourly" && !settings.general.hourlyRateStatus) {
    throw new AppError("Hourly hire is not available", 400);
  }

  if (input.passengers > settings.general.maxPassengers) {
    throw new AppError(`Maximum ${settings.general.maxPassengers} passengers are allowed per booking`, 400);
  }

  checkPickupSlot(input.pickupDate, input.pickupTime, settings, "pickup");

  if (input.tripType === "return") {
    checkPickupSlot(input.returnDate, input.returnTime, settings, "return");

    const pickupMoment = input.pickupDate + " " + input.pickupTime;
    const returnMoment = input.returnDate + " " + input.returnTime;
    if (returnMoment <= pickupMoment) {
      throw new AppError("The return must be after the pickup", 400);
    }
  }

  const addressesToCheck = [input.pickup, ...input.via];
  if (input.dropoff !== "") {
    addressesToCheck.push(input.dropoff);
  }
  for (const address of addressesToCheck) {
    if (await isAddressBanned(address)) {
      throw new AppError("Sorry, we cannot accept bookings for one of these addresses", 400);
    }
  }
}

// ---------- Location charges ----------

// Pickup/dropoff (drop down address) charge aur congestion charge.
// Congestion: pickup, via ya dropoff me se jis ka bhi charge sab se zyada ho wohi ek baar lagta hai
async function getLocationCharges(input: QuoteInput): Promise<LocationCharges> {
  const pickupCharge = await getDropdownAddressCharge(input.pickup, "pickup");

  let dropoffCharge = 0;
  if (input.dropoff !== "") {
    dropoffCharge = await getDropdownAddressCharge(input.dropoff, "dropoff");
  }

  const stops = [input.pickup, ...input.via];
  if (input.dropoff !== "") {
    stops.push(input.dropoff);
  }

  let congestionCharge = 0;
  for (const stop of stops) {
    const postcode = extractPostcode(stop);
    if (postcode === "") {
      continue;
    }
    const charge = await getCongestionCharge(postcode);
    if (charge > congestionCharge) {
      congestionCharge = charge;
    }
  }

  return { pickupCharge: pickupCharge, dropoffCharge: dropoffCharge, congestionCharge: congestionCharge };
}

// Wapsi ke safar me pickup aur dropoff ulte ho jate hain
function reverseLocationCharges(location: LocationCharges): LocationCharges {
  return {
    pickupCharge: location.dropoffCharge,
    dropoffCharge: location.pickupCharge,
    congestionCharge: location.congestionCharge,
  };
}

// ---------- Ek leg ----------

// Base fare: fixed price route, ya hourly, ya miles wala fare (+ vehicle ki fixed price + premium)
async function buildBaseFareLines(params: LegParams): Promise<LegResult> {
  const { vehicle, labelPrefix } = params;
  const lines: QuoteLine[] = [];

  if (params.tripType === "hourly") {
    if (vehicle.hourlyRate <= 0) {
      return { lines: [], unavailableReason: "Hourly hire is not available for this vehicle" };
    }
    const hourlyFare = roundMoney(params.hourlyDuration * vehicle.hourlyRate);
    lines.push({ label: `${labelPrefix}Hourly hire (${params.hourlyDuration} hours)`, amount: hourlyFare });
    return { lines: lines, unavailableReason: "" };
  }

  // Fixed price route mile to mileage calculation skip, aur premium bhi nahi lagta
  const fixedRouteFare = await findFixedPrice(params.pickup, params.dropoff, vehicle.id);
  if (fixedRouteFare !== null) {
    lines.push({ label: `${labelPrefix}Fixed price route`, amount: roundMoney(fixedRouteFare) });
    return { lines: lines, unavailableReason: "" };
  }

  const distanceFare = calculateDistanceFare(vehicle, params.miles);
  if (distanceFare === null) {
    return { lines: [], unavailableReason: "No rates are set for this vehicle" };
  }
  lines.push({ label: `${labelPrefix}Distance fare (${params.miles} miles)`, amount: distanceFare });
  if (vehicle.fixedPrice > 0) {
    lines.push({ label: `${labelPrefix}Vehicle base price`, amount: roundMoney(vehicle.fixedPrice) });
  }

  // Premium (Calculation Format) mileage fare + vehicle base price par lagta hai
  const baseFare = addUpLines(lines);
  const premium = calculatePremium(baseFare, vehicle.calculationFormat);
  if (premium !== 0) {
    let premiumLabel = `${labelPrefix}Vehicle premium`;
    if (vehicle.calculationFormat.type === "percent") {
      premiumLabel = `${labelPrefix}Vehicle premium (${vehicle.calculationFormat.value}%)`;
    }
    lines.push({ label: premiumLabel, amount: premium });
  }

  return { lines: lines, unavailableReason: "" };
}

// Ek leg ki saari lines: base fare, return discount, location charges, surcharges
async function buildLeg(params: LegParams): Promise<LegResult> {
  const baseResult = await buildBaseFareLines(params);
  if (baseResult.unavailableReason !== "") {
    return baseResult;
  }

  const lines = baseResult.lines;
  let legFare = addUpLines(lines);

  // Return leg par vehicle ka return discount (%)
  if (params.isReturnLeg && params.vehicle.returnDiscountRate > 0) {
    const returnDiscount = roundMoney((legFare * params.vehicle.returnDiscountRate) / 100);
    lines.push({ label: `${params.labelPrefix}Return discount (${params.vehicle.returnDiscountRate}%)`, amount: -returnDiscount });
    legFare = roundMoney(legFare - returnDiscount);
  }

  // Location charges
  const location = params.location;
  if (location.pickupCharge > 0) {
    lines.push({ label: `${params.labelPrefix}Pickup charge`, amount: roundMoney(location.pickupCharge) });
  }
  if (location.dropoffCharge > 0) {
    lines.push({ label: `${params.labelPrefix}Drop-off charge`, amount: roundMoney(location.dropoffCharge) });
  }
  if (location.congestionCharge > 0) {
    lines.push({ label: `${params.labelPrefix}Congestion charge`, amount: roundMoney(location.congestionCharge) });
  }

  // Surcharges (teeno saath lag sakti hain). Percent wali surcharge leg ke fare par lagti hai
  const nightSurcharge = await getNightSurchargeAmount(params.time, legFare);
  if (nightSurcharge > 0) {
    lines.push({ label: `${params.labelPrefix}Night surcharge`, amount: nightSurcharge });
  }
  const dateSurcharge = await getDateSurchargeTotal(params.date, params.time, legFare);
  if (dateSurcharge > 0) {
    lines.push({ label: `${params.labelPrefix}Date surcharge`, amount: dateSurcharge });
  }
  const addressSurcharge = await getAddressSurchargeTotal(params.pickup, params.dropoff, params.time);
  if (addressSurcharge > 0) {
    lines.push({ label: `${params.labelPrefix}Address surcharge`, amount: addressSurcharge });
  }

  return { lines: lines, unavailableReason: "" };
}

// ---------- Ek vehicle ----------

interface VehicleQuoteParams {
  vehicle: VehicleResponse;
  input: QuoteInput;
  settings: SettingsResponse;
  miles: number;
  outboundLocation: LocationCharges;
  couponCode: string;
}

function makeUnavailableQuote(vehicle: VehicleResponse, reason: string): VehicleQuote {
  return { vehicleId: vehicle.id, vehicleName: vehicle.name, available: false, unavailableReason: reason, lines: [], total: 0, couponDiscount: 0 };
}

async function buildVehicleQuote(params: VehicleQuoteParams): Promise<VehicleQuote> {
  const { vehicle, input, settings } = params;

  if (input.passengers > vehicle.passengerCapacity) {
    return makeUnavailableQuote(vehicle, `This vehicle carries up to ${vehicle.passengerCapacity} passengers`);
  }

  const isReturnTrip = input.tripType === "return";
  let outboundPrefix = "";
  if (isReturnTrip) {
    outboundPrefix = "Outbound – ";
  }

  const outboundLeg = await buildLeg({
    vehicle: vehicle,
    settings: settings,
    tripType: input.tripType,
    pickup: input.pickup,
    dropoff: input.dropoff,
    date: input.pickupDate,
    time: input.pickupTime,
    miles: params.miles,
    hourlyDuration: input.hourlyDuration,
    location: params.outboundLocation,
    isReturnLeg: false,
    labelPrefix: outboundPrefix,
  });
  if (outboundLeg.unavailableReason !== "") {
    return makeUnavailableQuote(vehicle, outboundLeg.unavailableReason);
  }

  const lines = outboundLeg.lines;

  // Wapsi ka leg: pickup/dropoff ulte, return ki date aur time
  if (isReturnTrip) {
    const returnLeg = await buildLeg({
      vehicle: vehicle,
      settings: settings,
      tripType: input.tripType,
      pickup: input.dropoff,
      dropoff: input.pickup,
      date: input.returnDate,
      time: input.returnTime,
      miles: params.miles,
      hourlyDuration: 0,
      location: reverseLocationCharges(params.outboundLocation),
      isReturnLeg: true,
      labelPrefix: "Return – ",
    });
    if (returnLeg.unavailableReason !== "") {
      return makeUnavailableQuote(vehicle, returnLeg.unavailableReason);
    }
    lines.push(...returnLeg.lines);

    if (settings.extras.returnExtraPrice > 0) {
      lines.push({ label: "Return journey extra", amount: roundMoney(settings.extras.returnExtraPrice) });
    }
  }

  // Extras poori booking par ek baar lagte hain
  lines.push(...calculateExtraLines(input.extras, settings.extras));

  // Har via stop par admin ki set ki hui price (poori booking par ek baar)
  if (input.via.length > 0 && settings.extras.viaPrice > 0) {
    lines.push({
      label: `Via stop × ${input.via.length}`,
      amount: roundMoney(input.via.length * settings.extras.viaPrice),
    });
  }

  // Discounts: pehle global discount, phir coupon (dono pure total par)
  let total = addUpLines(lines);

  const globalDiscount = calculateDiscount(total, settings.discount.globalDiscountType, settings.discount.globalDiscountValue);
  if (globalDiscount > 0) {
    lines.push({ label: "Discount", amount: -globalDiscount });
    total = roundMoney(total - globalDiscount);
  }

  let couponDiscount = 0;
  if (params.couponCode !== "") {
    const coupon = await validateCoupon(params.couponCode, input.pickupDate);
    couponDiscount = calculateCouponDiscount(coupon, total);
    if (couponDiscount > 0) {
      lines.push({ label: `Coupon ${coupon.code}`, amount: -couponDiscount });
      total = roundMoney(total - couponDiscount);
    }
  }

  // Round off setting on ho to nearest whole pound
  if (settings.pricing.roundOff) {
    const roundedTotal = roundToWholePound(total);
    const roundOffAmount = roundMoney(roundedTotal - total);
    if (roundOffAmount !== 0) {
      lines.push({ label: "Round off", amount: roundOffAmount });
    }
    total = roundedTotal;
  }

  return { vehicleId: vehicle.id, vehicleName: vehicle.name, available: true, unavailableReason: "", lines: lines, total: total, couponDiscount: couponDiscount };
}

// ---------- Public function ----------

// Journey ka quote: har vehicle ki price aur breakdown. Galat input ya banned address par AppError
export async function createQuote(input: QuoteInput): Promise<QuoteResponse> {
  const settings = await getSettings();
  await runChecks(input, settings);

  let vehicles = await getAllVehicles();
  if (input.vehicleId !== "") {
    vehicles = vehicles.filter((vehicle) => vehicle.id === input.vehicleId);
    if (vehicles.length === 0) {
      throw new AppError("Vehicle not found", 404);
    }
  }

  // Coupon galat ho to pehle hi error (har vehicle ke liye alag error nahi)
  if (input.couponCode !== "") {
    await validateCoupon(input.couponCode, input.pickupDate);
  }

  // Hourly hire me distance nahi chahiye
  let miles = 0;
  if (input.tripType !== "hourly") {
    miles = await getDistanceInMiles(input.pickup, input.via, input.dropoff);
  }

  const outboundLocation = await getLocationCharges(input);

  const vehicleQuotes: VehicleQuote[] = [];
  for (const vehicle of vehicles) {
    const vehicleQuote = await buildVehicleQuote({
      vehicle: vehicle,
      input: input,
      settings: settings,
      miles: miles,
      outboundLocation: outboundLocation,
      couponCode: input.couponCode,
    });
    vehicleQuotes.push(vehicleQuote);
  }

  return {
    tripType: input.tripType,
    distanceMiles: miles,
    currency: settings.office.currency,
    couponCode: input.couponCode,
    vehicles: vehicleQuotes,
  };
}
