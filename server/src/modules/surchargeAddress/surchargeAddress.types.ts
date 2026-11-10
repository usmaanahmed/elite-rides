// Surcharge address module ke TypeScript types
import { Types } from "mongoose";

export type SurchargeStatus = "active" | "inactive";

export interface SurchargeAddressInput {
  // Customer ke address me yeh text mile to surcharge lagta hai, e.g. "heathrow"
  address: string;
  // Din ki window "HH:mm", from > to ho sakta hai (midnight cross)
  fromTime: string;
  toTime: string;
  // Pounds me
  price: number;
  status: SurchargeStatus;
}

export interface SurchargeAddressRecord extends SurchargeAddressInput {
  _id: Types.ObjectId;
}

export interface SurchargeAddressResponse extends SurchargeAddressInput {
  id: string;
}
