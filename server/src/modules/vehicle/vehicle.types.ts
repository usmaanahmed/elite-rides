// Vehicle module ke TypeScript types
import { Types } from "mongoose";

// Form se aane wali values (validation ke baad)
export interface VehicleInput {
  name: string;
  description: string;
  passengerCapacity: number;
  luggageCapacity: number;
  handLuggageCapacity: number;
  // Percentage, e.g. 10 matlab 10% discount
  discountRate: number;
  returnDiscountRate: number;
}

// Edit form se aane wali values (naya image dena optional hai)
export interface VehicleUpdateInput extends VehicleInput {
  displayOrder: number;
}

// Ek mileage band, e.g. "1 to 20 miles @ £2.50 per mile"
export interface MileageBand {
  fromMiles: number;
  toMiles: number;
  ratePerMile: number;
}

// Ek slab band, e.g. "1 to 20 miles = £50 flat"
export interface SlabBand {
  fromMiles: number;
  toMiles: number;
  price: number;
}

export type RateType = "mileage" | "slab";

// "£ Rates" modal se aane wali values
export interface RatesInput {
  rateType: RateType;
  fixedPrice: number;
  hourlyRate: number;
  mileageBands: MileageBand[];
  slabBands: SlabBand[];
}

export type CalculationFormatType = "percent" | "fixed";

export interface CalculationFormat {
  type: CalculationFormatType;
  value: number;
}

// "Add Calculation Format" modal se ek vehicle ki entry
export interface CalculationFormatItem {
  vehicleId: string;
  type: CalculationFormatType;
  value: number;
}

// Vehicle jaisa database me save hota hai
export interface VehicleRecord extends VehicleInput {
  _id: Types.ObjectId;
  tbmsId: number;
  // Sirf file ka naam, e.g. "1700000000-123.jpg"
  imageFileName: string;
  displayOrder: number;
  fixedPrice: number;
  hourlyRate: number;
  rateType: RateType;
  mileageBands: MileageBand[];
  slabBands: SlabBand[];
  // Mongoose ke lean() result me nested object optional/null nikalta hai
  calculationFormat?: CalculationFormat | null;
}

// Vehicle jaisa frontend ko bheja jaata hai
export interface VehicleResponse extends VehicleInput {
  id: string;
  tbmsId: string;
  // e.g. "/uploads/vehicles/1700000000-123.jpg"
  imageUrl: string;
  displayOrder: number;
  fixedPrice: number;
  hourlyRate: number;
  rateType: RateType;
  mileageBands: MileageBand[];
  slabBands: SlabBand[];
  calculationFormat: CalculationFormat;
}
