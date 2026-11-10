// Congestion address ki business logic
import { isValidObjectId } from "mongoose";
import { AppError } from "../../utils/AppError.js";
import {
  createCongestionAddress as saveCongestionAddress,
  deleteCongestionAddressById,
  findAllCongestionAddresses,
  findCongestionAddressById,
  findCongestionAddressByPostcode,
  updateCongestionAddressById,
} from "./congestionAddress.repository.js";
import {
  CongestionAddressInput,
  CongestionAddressRecord,
  CongestionAddressResponse,
} from "./congestionAddress.types.js";

function toCongestionAddressResponse(record: CongestionAddressRecord): CongestionAddressResponse {
  return { id: record._id.toString(), postcode: record.postcode, price: record.price };
}

// Postcode uppercase me aur spaces ke baghair save/compare hota hai ("ec1 a" -> "EC1A")
function cleanPostcode(postcode: string): string {
  return postcode.replace(/\s+/g, "").toUpperCase();
}

async function checkPostcodeIsFree(postcode: string, ownId?: string) {
  const existing = await findCongestionAddressByPostcode(postcode);
  if (existing && existing._id.toString() !== ownId) {
    throw new AppError("postcode: This postcode already has a congestion charge", 409);
  }
}

export async function getAllCongestionAddresses(): Promise<CongestionAddressResponse[]> {
  const records = await findAllCongestionAddresses();
  return records.map(toCongestionAddressResponse);
}

export async function createCongestionAddress(input: CongestionAddressInput): Promise<CongestionAddressResponse> {
  const postcode = cleanPostcode(input.postcode);
  await checkPostcodeIsFree(postcode);

  const record = await saveCongestionAddress({ postcode: postcode, price: input.price });
  return toCongestionAddressResponse(record);
}

export async function updateCongestionAddress(id: string, input: CongestionAddressInput): Promise<CongestionAddressResponse> {
  if (!isValidObjectId(id)) {
    throw new AppError("Congestion address not found", 404);
  }

  const existing = await findCongestionAddressById(id);
  if (!existing) {
    throw new AppError("Congestion address not found", 404);
  }

  const postcode = cleanPostcode(input.postcode);
  await checkPostcodeIsFree(postcode, id);

  const updated = await updateCongestionAddressById(id, { postcode: postcode, price: input.price });
  if (!updated) {
    throw new AppError("Congestion address not found", 404);
  }
  return toCongestionAddressResponse(updated);
}

export async function deleteCongestionAddress(id: string): Promise<void> {
  if (!isValidObjectId(id)) {
    throw new AppError("Congestion address not found", 404);
  }

  const deleted = await deleteCongestionAddressById(id);
  if (!deleted) {
    throw new AppError("Congestion address not found", 404);
  }
}

// Fare engine ke liye (Phase 8): ek postcode par kitna congestion charge lagta hai.
// Customer ke postcode ki shuruaat saved prefix se milti ho to us ka charge (match na ho to 0)
export async function getCongestionCharge(customerPostcode: string): Promise<number> {
  const cleaned = cleanPostcode(customerPostcode);
  const allCharges = await findAllCongestionAddresses();

  for (const charge of allCharges) {
    if (cleaned.startsWith(charge.postcode)) {
      return charge.price;
    }
  }
  return 0;
}
