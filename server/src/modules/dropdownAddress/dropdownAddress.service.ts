// Drop down address ki business logic
import { isValidObjectId } from "mongoose";
import { AppError } from "../../utils/AppError.js";
import {
  createDropdownAddress as saveDropdownAddress,
  deleteDropdownAddressById,
  findAllDropdownAddresses,
  findDropdownAddressByComparableValue,
  findDropdownAddressById,
  updateDropdownAddressById,
} from "./dropdownAddress.repository.js";
import {
  DropdownAddressInput,
  DropdownAddressRecord,
  DropdownAddressResponse,
  ImportResult,
  ImportRowError,
} from "./dropdownAddress.types.js";
import { dropdownAddressSchema } from "./dropdownAddress.validation.js";

// Database wali address ko frontend ke format me badalta hai
function toDropdownAddressResponse(record: DropdownAddressRecord): DropdownAddressResponse {
  return {
    id: record._id.toString(),
    address: record.address,
    comparableValue: record.comparableValue,
    pickupCharge: record.pickupCharge,
    dropoffCharge: record.dropoffCharge,
    type: record.type,
  };
}

// Comparable value hamesha lowercase me save aur compare hoti hai
function cleanInput(input: DropdownAddressInput): DropdownAddressInput {
  return { ...input, comparableValue: input.comparableValue.trim().toLowerCase() };
}

// Same comparable value wali doosri address mojood ho to error
async function checkComparableValueIsFree(comparableValue: string, ownId?: string) {
  const existing = await findDropdownAddressByComparableValue(comparableValue);
  if (existing && existing._id.toString() !== ownId) {
    throw new AppError("comparableValue: This comparable value is already used by another address", 409);
  }
}

// Fare engine ke liye (Phase 8): customer ke address me kisi dropdown address ki comparableValue mile
// to us ka pickup ya dropoff charge. Kai match hon to sab se lambi (sab se khaas) comparableValue jeet-ti hai.
// Koi match na ho to 0.
export async function getDropdownAddressCharge(customerAddress: string, direction: "pickup" | "dropoff"): Promise<number> {
  const lowerAddress = customerAddress.toLowerCase();
  const allAddresses = await findAllDropdownAddresses();

  let bestMatch: DropdownAddressRecord | null = null;
  for (const address of allAddresses) {
    if (!lowerAddress.includes(address.comparableValue)) {
      continue;
    }
    if (bestMatch === null || address.comparableValue.length > bestMatch.comparableValue.length) {
      bestMatch = address as unknown as DropdownAddressRecord;
    }
  }

  if (bestMatch === null) {
    return 0;
  }
  if (direction === "pickup") {
    return bestMatch.pickupCharge;
  }
  return bestMatch.dropoffCharge;
}

export async function getAllDropdownAddresses(): Promise<DropdownAddressResponse[]> {
  const records = await findAllDropdownAddresses();
  return records.map(toDropdownAddressResponse);
}

export async function createDropdownAddress(input: DropdownAddressInput): Promise<DropdownAddressResponse> {
  const cleanedInput = cleanInput(input);
  await checkComparableValueIsFree(cleanedInput.comparableValue);

  const record = await saveDropdownAddress(cleanedInput);
  return toDropdownAddressResponse(record);
}

export async function updateDropdownAddress(id: string, input: DropdownAddressInput): Promise<DropdownAddressResponse> {
  if (!isValidObjectId(id)) {
    throw new AppError("Address not found", 404);
  }

  const existing = await findDropdownAddressById(id);
  if (!existing) {
    throw new AppError("Address not found", 404);
  }

  const cleanedInput = cleanInput(input);
  await checkComparableValueIsFree(cleanedInput.comparableValue, id);

  const updated = await updateDropdownAddressById(id, cleanedInput);
  if (!updated) {
    throw new AppError("Address not found", 404);
  }
  return toDropdownAddressResponse(updated);
}

export async function deleteDropdownAddress(id: string): Promise<void> {
  if (!isValidObjectId(id)) {
    throw new AppError("Address not found", 404);
  }

  const deleted = await deleteDropdownAddressById(id);
  if (!deleted) {
    throw new AppError("Address not found", 404);
  }
}

// CSV se aayi rows ek ek karke check + save karo. Galat row skip hoti hai aur report me aati hai
export async function importDropdownAddresses(rows: Record<string, unknown>[]): Promise<ImportResult> {
  const errors: ImportRowError[] = [];
  let addedCount = 0;

  for (let i = 0; i < rows.length; i++) {
    // Row number file ke hisaab se (header row 1 hai, is liye data 2 se shuru)
    const rowNumber = i + 2;
    const result = dropdownAddressSchema.safeParse(rows[i]);

    if (!result.success) {
      const issue = result.error.issues[0];
      errors.push({ row: rowNumber, message: issue.path.join(".") + ": " + issue.message });
      continue;
    }

    try {
      await createDropdownAddress(result.data);
      addedCount++;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not save this row";
      errors.push({ row: rowNumber, message: message });
    }
  }

  return { addedCount: addedCount, errors: errors };
}
