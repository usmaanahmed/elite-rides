// Surcharge address ki business logic
import { isValidObjectId } from "mongoose";
import { AppError } from "../../utils/AppError.js";
import { isTimeInWindow } from "../../utils/isTimeInWindow.js";
import { roundMoney } from "../../utils/roundMoney.js";
import {
  createSurchargeAddress as saveSurchargeAddress,
  deleteSurchargeAddressById,
  findActiveSurchargeAddresses,
  findAllSurchargeAddresses,
  updateSurchargeAddressById,
} from "./surchargeAddress.repository.js";
import {
  SurchargeAddressInput,
  SurchargeAddressRecord,
  SurchargeAddressResponse,
} from "./surchargeAddress.types.js";

function toSurchargeAddressResponse(record: SurchargeAddressRecord): SurchargeAddressResponse {
  return {
    id: record._id.toString(),
    address: record.address,
    fromTime: record.fromTime,
    toTime: record.toTime,
    price: record.price,
    status: record.status,
  };
}

export async function getAllSurchargeAddresses(): Promise<SurchargeAddressResponse[]> {
  const records = await findAllSurchargeAddresses();
  return records.map((record) => toSurchargeAddressResponse(record as unknown as SurchargeAddressRecord));
}

export async function createSurchargeAddress(input: SurchargeAddressInput): Promise<SurchargeAddressResponse> {
  const record = await saveSurchargeAddress(input);
  return toSurchargeAddressResponse(record.toObject() as unknown as SurchargeAddressRecord);
}

export async function updateSurchargeAddress(id: string, input: SurchargeAddressInput): Promise<SurchargeAddressResponse> {
  if (!isValidObjectId(id)) {
    throw new AppError("Surcharge address not found", 404);
  }

  const updated = await updateSurchargeAddressById(id, input);
  if (!updated) {
    throw new AppError("Surcharge address not found", 404);
  }
  return toSurchargeAddressResponse(updated as unknown as SurchargeAddressRecord);
}

export async function deleteSurchargeAddress(id: string): Promise<void> {
  if (!isValidObjectId(id)) {
    throw new AppError("Surcharge address not found", 404);
  }

  const deleted = await deleteSurchargeAddressById(id);
  if (!deleted) {
    throw new AppError("Surcharge address not found", 404);
  }
}

// Fare engine ke liye (Phase 8): pickup ya dropoff address par active surcharges ka total.
// Rule: pickup ya dropoff me se koi bhi match ho, aur pickup time window ke andar ho.
// Har surcharge row sirf ek baar lagti hai, chahe dono addresses match hon.
export async function getAddressSurchargeTotal(
  pickupAddress: string,
  dropoffAddress: string,
  pickupTime: string
): Promise<number> {
  const pickupText = pickupAddress.toLowerCase();
  const dropoffText = dropoffAddress.toLowerCase();
  const activeSurcharges = await findActiveSurchargeAddresses();

  let total = 0;
  for (const surcharge of activeSurcharges) {
    const matchText = surcharge.address.toLowerCase();
    const addressMatches = pickupText.includes(matchText) || dropoffText.includes(matchText);
    if (addressMatches && isTimeInWindow(pickupTime, surcharge.fromTime, surcharge.toTime)) {
      total = total + surcharge.price;
    }
  }
  return roundMoney(total);
}
