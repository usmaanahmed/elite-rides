// Congestion address module ke TypeScript types
import { Types } from "mongoose";

export interface CongestionAddressInput {
  // Postcode prefix, e.g. "EC1", "WC2"
  postcode: string;
  // Pounds me charge
  price: number;
}

export interface CongestionAddressRecord extends CongestionAddressInput {
  _id: Types.ObjectId;
}

export interface CongestionAddressResponse extends CongestionAddressInput {
  id: string;
}
