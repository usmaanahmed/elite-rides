// Settings ka database structure. Poori company ki sirf ek hi document hogi
import { model, Schema } from "mongoose";

// Ek mileage band, e.g. "1 to 20 miles @ £2.50 per mile"
const mileageBandSchema = new Schema(
  {
    fromMiles: { type: Number, required: true },
    toMiles: { type: Number, required: true },
    ratePerMile: { type: Number, required: true },
  },
  { _id: false }
);

// Ek slab band, e.g. "1 to 20 miles = £50 flat"
const slabBandSchema = new Schema(
  {
    fromMiles: { type: Number, required: true },
    toMiles: { type: Number, required: true },
    price: { type: Number, required: true },
  },
  { _id: false }
);

const settingSchema = new Schema(
  {
    office: {
      companyName: { type: String, default: "Elite London Rides" },
      appName: { type: String, default: "Elite Rides" },
      currency: { type: String, default: "£" },
      companyEmail: { type: String, default: "" },
      fromEmail: { type: String, default: "" },
      siteUrl: { type: String, default: "" },
    },
    pricing: {
      mileageBySlabs: { type: Boolean, default: false },
      roundOff: { type: Boolean, default: false },
      setPrice: { type: String, enum: ["per_vehicle", "single_price"], default: "per_vehicle" },
      showCard: { type: Boolean, default: false },
      // "single_price" mode me saari vehicles yehi shared base fare + bands use karti hain
      singleRates: {
        fixedPrice: { type: Number, default: 0 },
        mileageBands: { type: [mileageBandSchema], default: [] },
        slabBands: { type: [slabBandSchema], default: [] },
      },
    },
    extras: {
      babySeatPrice: { type: Number, default: 0 },
      boosterSeatPrice: { type: Number, default: 0 },
      meetAndGreetPrice: { type: Number, default: 0 },
      luggagePrice: { type: Number, default: 0 },
      specialLuggagePrice: { type: Number, default: 0 },
      wheelchairPrice: { type: Number, default: 0 },
      petPrice: { type: Number, default: 0 },
      returnExtraPrice: { type: Number, default: 0 },
      waitingPricePer5Minutes: { type: Number, default: 0 },
      viaPrice: { type: Number, default: 0 },
    },
    general: {
      guestLogin: { type: Boolean, default: true },
      hourlyRateStatus: { type: Boolean, default: false },
      isQuotation: { type: Boolean, default: false },
      graceTimeMinutes: { type: Number, default: 0 },
      maxPassengers: { type: Number, default: 20 },
      bookingNumberPrefix: { type: String, default: "ELR" },
      blockDateFrom: { type: String, default: "" },
      blockDateTo: { type: String, default: "" },
      blockTimeFrom: { type: String, default: "" },
      blockTimeTo: { type: String, default: "" },
      bookingSuccessRedirectUrl: { type: String, default: "" },
    },
    discount: {
      globalDiscountType: { type: String, enum: ["none", "fixed", "percent"], default: "none" },
      globalDiscountValue: { type: Number, default: 0 },
      pretendDiscountType: { type: String, enum: ["none", "fixed", "percent"], default: "none" },
      pretendDiscountValue: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

export const Setting = model("Setting", settingSchema);
