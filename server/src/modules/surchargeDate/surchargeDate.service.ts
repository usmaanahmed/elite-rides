// Surcharge on date ki business logic
import { isValidObjectId } from "mongoose";
import { AppError } from "../../utils/AppError.js";
import { isTimeInWindow } from "../../utils/isTimeInWindow.js";
import { roundMoney } from "../../utils/roundMoney.js";
import {
  createSurchargeDate as saveSurchargeDate,
  deleteSurchargeDateById,
  findActiveSurchargeDatesByDate,
  findAllSurchargeDates,
  updateSurchargeDateById,
} from "./surchargeDate.repository.js";
import { SurchargeDateInput, SurchargeDateRecord, SurchargeDateResponse } from "./surchargeDate.types.js";

function toSurchargeDateResponse(record: SurchargeDateRecord): SurchargeDateResponse {
  return {
    id: record._id.toString(),
    date: record.date,
    amountType: record.amountType,
    amount: record.amount,
    fromTime: record.fromTime,
    toTime: record.toTime,
    status: record.status,
  };
}

export async function getAllSurchargeDates(): Promise<SurchargeDateResponse[]> {
  const records = await findAllSurchargeDates();
  return records.map((record) => toSurchargeDateResponse(record as unknown as SurchargeDateRecord));
}

export async function createSurchargeDate(input: SurchargeDateInput): Promise<SurchargeDateResponse> {
  const record = await saveSurchargeDate(input);
  return toSurchargeDateResponse(record.toObject() as unknown as SurchargeDateRecord);
}

export async function updateSurchargeDate(id: string, input: SurchargeDateInput): Promise<SurchargeDateResponse> {
  if (!isValidObjectId(id)) {
    throw new AppError("Surcharge date not found", 404);
  }

  const updated = await updateSurchargeDateById(id, input);
  if (!updated) {
    throw new AppError("Surcharge date not found", 404);
  }
  return toSurchargeDateResponse(updated as unknown as SurchargeDateRecord);
}

export async function deleteSurchargeDate(id: string): Promise<void> {
  if (!isValidObjectId(id)) {
    throw new AppError("Surcharge date not found", 404);
  }

  const deleted = await deleteSurchargeDateById(id);
  if (!deleted) {
    throw new AppError("Surcharge date not found", 404);
  }
}

// Fare engine ke liye (Phase 8): pickup date par active date surcharges ka total.
// fare = abhi tak ka fare (percent wali surcharge isi par lagti hai)
export async function getDateSurchargeTotal(pickupDate: string, pickupTime: string, fare: number): Promise<number> {
  const surcharges = await findActiveSurchargeDatesByDate(pickupDate);

  let total = 0;
  for (const surcharge of surcharges) {
    // Time window di hui hai to pickup time us ke andar hona chahiye
    const hasTimeWindow = surcharge.fromTime !== "" && surcharge.toTime !== "";
    if (hasTimeWindow && !isTimeInWindow(pickupTime, surcharge.fromTime, surcharge.toTime)) {
      continue;
    }

    if (surcharge.amountType === "percent") {
      total = total + (fare * surcharge.amount) / 100;
    } else {
      total = total + surcharge.amount;
    }
  }
  return roundMoney(total);
}
