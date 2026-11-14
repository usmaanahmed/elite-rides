// Settings module ke TypeScript types
import { Types } from "mongoose";
import { MileageBand, SlabBand } from "../vehicle/vehicle.types.js";

// Discount ki type: none = koi discount nahi
export type DiscountType = "none" | "fixed" | "percent";

// Office / company ki info
export interface OfficeSettings {
  companyName: string;
  appName: string;
  currency: string;
  companyEmail: string;
  fromEmail: string;
  siteUrl: string;
}

// Single price mode ka shared rate table (saari vehicles ke liye)
export interface SingleRates {
  fixedPrice: number;
  mileageBands: MileageBand[];
  slabBands: SlabBand[];
}

// Pricing config.
// mileageBySlabs: on = slab bands, off = per-mile bands (saari vehicles ke liye)
// setPrice: "per_vehicle" = har vehicle ka apna rate table, "single_price" = singleRates sab ke liye
export interface PricingSettings {
  mileageBySlabs: boolean;
  roundOff: boolean;
  setPrice: "per_vehicle" | "single_price";
  showCard: boolean;
  // Website par "Pay in car" ka option
  showCash: boolean;
  singleRates: SingleRates;
}

// Extras ki qeematein (pounds me)
export interface ExtrasSettings {
  babySeatPrice: number;
  boosterSeatPrice: number;
  meetAndGreetPrice: number;
  luggagePrice: number;
  specialLuggagePrice: number;
  wheelchairPrice: number;
  // Pet ki flat price
  petPrice: number;
  returnExtraPrice: number;
  waitingPricePer5Minutes: number;
  // Har via stop ki extra price
  viaPrice: number;
}

// General rules. Khaali string = woh option band
export interface GeneralSettings {
  guestLogin: boolean;
  hourlyRateStatus: boolean;
  isQuotation: boolean;
  graceTimeMinutes: number;
  maxPassengers: number;
  bookingNumberPrefix: string;
  blockDateFrom: string; // YYYY-MM-DD
  blockDateTo: string; // YYYY-MM-DD
  blockTimeFrom: string; // HH:MM
  blockTimeTo: string; // HH:MM
  bookingSuccessRedirectUrl: string;
}

// Discount settings. pretend discount sirf display ke liye hai
export interface DiscountSettings {
  globalDiscountType: DiscountType;
  globalDiscountValue: number;
  pretendDiscountType: DiscountType;
  pretendDiscountValue: number;
}

// Poori settings (jo client bhejta hai aur server wapas deta hai)
export interface SettingsInput {
  office: OfficeSettings;
  pricing: PricingSettings;
  extras: ExtrasSettings;
  general: GeneralSettings;
  discount: DiscountSettings;
}

// Database se aaya hua record
export interface SettingsRecord extends SettingsInput {
  _id: Types.ObjectId;
}

export type SettingsResponse = SettingsInput;
