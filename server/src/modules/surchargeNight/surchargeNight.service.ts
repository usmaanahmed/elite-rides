// Night surcharge ki business logic
import { isValidObjectId } from "mongoose";
import { AppError } from "../../utils/AppError.js";
import { isTimeInWindow } from "../../utils/isTimeInWindow.js";
import { roundMoney } from "../../utils/roundMoney.js";
import {
  createSurchargeNight as saveSurchargeNight,
  deleteSurchargeNightById,
  findActiveSurchargeNights,
  findAllSurchargeNights,
  updateSurchargeNightById,
} from "./surchargeNight.repository.js";
import { SurchargeNightInput, SurchargeNightRecord, SurchargeNightResponse } from "./surchargeNight.types.js";

// Database ke extra fields hata kar sirf kaam ke fields wapas karta hai
function toSurchargeNightResponse(record: SurchargeNightRecord): SurchargeNightResponse {
  return {
    id: record._id.toString(),
    startTime: record.startTime,
    endTime: record.endTime,
    amountType: record.amountType,
    amount: record.amount,
    status: record.status,
  };
}

export async function getAllSurchargeNights(): Promise<SurchargeNightResponse[]> {
  const records = await findAllSurchargeNights();
  return records.map((record) => toSurchargeNightResponse(record as unknown as SurchargeNightRecord));
}

export async function createSurchargeNight(input: SurchargeNightInput): Promise<SurchargeNightResponse> {
  const record = await saveSurchargeNight(input);
  return toSurchargeNightResponse(record.toObject() as unknown as SurchargeNightRecord);
}

export async function updateSurchargeNight(id: string, input: SurchargeNightInput): Promise<SurchargeNightResponse> {
  if (!isValidObjectId(id)) {
    throw new AppError("Surcharge night not found", 404);
  }

  const updated = await updateSurchargeNightById(id, input);
  if (!updated) {
    throw new AppError("Surcharge night not found", 404);
  }
  return toSurchargeNightResponse(updated as unknown as SurchargeNightRecord);
}

export async function deleteSurchargeNight(id: string): Promise<void> {
  if (!isValidObjectId(id)) {
    throw new AppError("Surcharge night not found", 404);
  }

  const deleted = await deleteSurchargeNightById(id);
  if (!deleted) {
    throw new AppError("Surcharge night not found", 404);
  }
}

// Fare engine ke liye: is pickup time par saari active night surcharges ka total.
// fare = abhi tak ka fare (percent wali surcharge isi par lagti hai). Window ke bahar = 0
export async function getNightSurchargeAmount(pickupTime: string, fare: number): Promise<number> {
  const nights = await findActiveSurchargeNights();

  let total = 0;
  for (const night of nights) {
    if (!isTimeInWindow(pickupTime, night.startTime, night.endTime)) {
      continue;
    }

    if (night.amountType === "percent") {
      total = total + (fare * night.amount) / 100;
    } else {
      total = total + night.amount;
    }
  }
  return roundMoney(total);
}
