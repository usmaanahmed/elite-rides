// Ban address module ke TypeScript types
import { Types } from "mongoose";

export interface BanAddressInput {
  address: string;
}

export interface BanAddressRecord extends BanAddressInput {
  _id: Types.ObjectId;
  // Lowercase copy, match karne ke liye
  comparableValue: string;
}

export interface BanAddressResponse extends BanAddressInput {
  id: string;
}
