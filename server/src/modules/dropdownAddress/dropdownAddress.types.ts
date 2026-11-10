// Drop down address module ke TypeScript types
import { Types } from "mongoose";

export type AddressType = "address" | "airport" | "station";

// Form se aane wali values (validation ke baad)
export interface DropdownAddressInput {
  address: string;
  comparableValue: string;
  // Pounds me, e.g. 7.5 matlab £7.50
  pickupCharge: number;
  dropoffCharge: number;
  type: AddressType;
}

// Address jaisa database me save hota hai
export interface DropdownAddressRecord extends DropdownAddressInput {
  _id: Types.ObjectId;
}

// Address jaisa frontend ko bheja jaata hai
export interface DropdownAddressResponse extends DropdownAddressInput {
  id: string;
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
