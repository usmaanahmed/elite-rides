// Fixed price module ke TypeScript types
import { Types } from "mongoose";

// "Add fixed price" form ka ek vehicle ka price box
export interface FixedPriceRow {
  vehicleId: string;
  fare: number;
}

// "Add fixed price" form: ek route, har vehicle ke liye alag fare
export interface CreateFixedPriceInput {
  pickupPostcode: string;
  dropCode: string;
  prices: FixedPriceRow[];
}

// Edit form: ek hi row (ek route ka ek vehicle)
export interface FixedPriceInput {
  pickupPostcode: string;
  dropCode: string;
  vehicleId: string;
  fare: number;
}

// Database me jaisa save hota hai
export interface FixedPriceRecord {
  _id: Types.ObjectId;
  pickupPostcode: string;
  dropCode: string;
  vehicleId: string;
  fare: number;
}

// Frontend ko jaisa bheja jaata hai
export interface FixedPriceResponse {
  id: string;
  pickupPostcode: string;
  dropCode: string;
  vehicleId: string;
  vehicleName: string;
  fare: number;
}

// CSV import ki ek galat row (kaunsi row kyun fail hui)
export interface ImportRowError {
  row: number;
  message: string;
}

export interface ImportResult {
  addedCount: number;
  errors: ImportRowError[];
}
