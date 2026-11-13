// Night surcharge module ke TypeScript types
export type SurchargeStatus = "active" | "inactive";
export type SurchargeAmountType = "fixed" | "percent";

export interface SurchargeNightInput {
  // Raat ki window "HH:mm", e.g. 22:00 se 06:00
  startTime: string;
  endTime: string;
  amountType: SurchargeAmountType;
  amount: number;
  status: SurchargeStatus;
}

// Database se aaya record (id ke saath)
export interface SurchargeNightRecord extends SurchargeNightInput {
  _id: { toString(): string };
}

export interface SurchargeNightResponse extends SurchargeNightInput {
  id: string;
}
