// Ban address ki business logic
import { isValidObjectId } from "mongoose";
import { AppError } from "../../utils/AppError.js";
import {
  createBanAddress as saveBanAddress,
  deleteBanAddressById,
  findAllBanAddresses,
  findBanAddressByComparableValue,
} from "./banAddress.repository.js";
import { BanAddressInput, BanAddressRecord, BanAddressResponse } from "./banAddress.types.js";

function toBanAddressResponse(record: BanAddressRecord): BanAddressResponse {
  return { id: record._id.toString(), address: record.address };
}

export async function getAllBanAddresses(): Promise<BanAddressResponse[]> {
  const records = await findAllBanAddresses();
  return records.map(toBanAddressResponse);
}

export async function createBanAddress(input: BanAddressInput): Promise<BanAddressResponse> {
  const comparableValue = input.address.trim().toLowerCase();

  const existing = await findBanAddressByComparableValue(comparableValue);
  if (existing) {
    throw new AppError("address: This address is already banned", 409);
  }

  const record = await saveBanAddress(input.address, comparableValue);
  return toBanAddressResponse(record);
}

export async function deleteBanAddress(id: string): Promise<void> {
  if (!isValidObjectId(id)) {
    throw new AppError("Banned address not found", 404);
  }

  const deleted = await deleteBanAddressById(id);
  if (!deleted) {
    throw new AppError("Banned address not found", 404);
  }
}

// Fare engine ke liye (Phase 8): customer ka address ban list me aata hai ya nahi.
// Banned address customer ke address ke andar mile to true (dono lowercase me compare hote hain)
export async function isAddressBanned(customerAddress: string): Promise<boolean> {
  const lowerAddress = customerAddress.toLowerCase();
  const bannedAddresses = await findAllBanAddresses();

  for (const banned of bannedAddresses) {
    if (lowerAddress.includes(banned.comparableValue)) {
      return true;
    }
  }
  return false;
}
