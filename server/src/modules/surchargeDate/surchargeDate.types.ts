// Surcharge on date module ke TypeScript types
import { Types } from "mongoose";

export type SurchargeStatus = "active" | "inactive";
export type SurchargeAmountType = "fixed" | "percent";

export interface SurchargeDateInput {
  // "YYYY-MM-DD"
  date: string;
  // fixed = pounds, percent = fare ka %
  amountType: SurchargeAmountType;
  amount: number;
  // Optional time window. Khaali ("") = poora din
  fromTime: string;
  toTime: string;
  status: SurchargeStatus;
}

export interface SurchargeDateRecord extends SurchargeDateInput {
  _id: Types.ObjectId;
}

export interface SurchargeDateResponse extends SurchargeDateInput {
  id: string;
}
