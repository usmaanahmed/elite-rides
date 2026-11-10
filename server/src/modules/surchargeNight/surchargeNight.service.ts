// Night surcharge ki business logic
import { isTimeInWindow } from "../../utils/isTimeInWindow.js";
import { roundMoney } from "../../utils/roundMoney.js";
import {
  createDefaultSurchargeNight,
  findSurchargeNight,
  updateSurchargeNight as saveSurchargeNight,
} from "./surchargeNight.repository.js";
import { SurchargeNightInput, SurchargeNightRecord, SurchargeNightResponse } from "./surchargeNight.types.js";

// Database ke extra fields (_id, createdAt...) hata kar sirf kaam ke fields wapas karta hai
function toSurchargeNightResponse(record: SurchargeNightRecord): SurchargeNightResponse {
  return {
    startTime: record.startTime,
    endTime: record.endTime,
    amountType: record.amountType,
    amount: record.amount,
    status: record.status,
  };
}

// Night surcharge wapas karta hai. Agar abhi tak bani nahi to default values ke saath bana deta hai
export async function getSurchargeNight(): Promise<SurchargeNightResponse> {
  const existing = await findSurchargeNight();
  if (existing) {
    return toSurchargeNightResponse(existing as unknown as SurchargeNightRecord);
  }

  const created = await createDefaultSurchargeNight();
  return toSurchargeNightResponse(created.toObject() as unknown as SurchargeNightRecord);
}

export async function updateSurchargeNight(input: SurchargeNightInput): Promise<SurchargeNightResponse> {
  const saved = await saveSurchargeNight(input);
  return toSurchargeNightResponse(saved as unknown as SurchargeNightRecord);
}

// Fare engine ke liye (Phase 8): is pickup time par night surcharge kitni lagti hai.
// fare = abhi tak ka fare (percent hone par isi par lagti hai). Inactive ya window ke bahar = 0
export async function getNightSurchargeAmount(pickupTime: string, fare: number): Promise<number> {
  const night = await getSurchargeNight();

  if (night.status !== "active") {
    return 0;
  }
  if (!isTimeInWindow(pickupTime, night.startTime, night.endTime)) {
    return 0;
  }

  if (night.amountType === "percent") {
    return roundMoney((fare * night.amount) / 100);
  }
  return roundMoney(night.amount);
}
