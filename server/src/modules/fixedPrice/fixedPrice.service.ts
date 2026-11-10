// Fixed price ki business logic
import { isValidObjectId } from "mongoose";
import { AppError } from "../../utils/AppError.js";
import { getAllVehicles } from "../vehicle/vehicle.service.js";
import {
  bulkInsertFixedPrices,
  createManyFixedPrices,
  deleteAllFixedPrices as deleteAllFixedPricesFromDb,
  deleteFixedPriceById,
  findAllFixedPriceKeys,
  findAllFixedPrices,
  findFixedPriceById,
  findFixedPriceByRoute,
  findFixedPricesByVehicle,
  updateFixedPriceById,
} from "./fixedPrice.repository.js";
import {
  CreateFixedPriceInput,
  FixedPriceInput,
  FixedPriceRecord,
  FixedPriceResponse,
  ImportResult,
  ImportRowError,
} from "./fixedPrice.types.js";
import { importFixedPricesRowSchema } from "./fixedPrice.validation.js";

// Pickup postcode spaces hata kar, uppercase me match hota hai
function normalizePickupPostcode(value: string): string {
  return value.replace(/\s+/g, "").toUpperCase();
}

// Drop code lowercase keyword ke tor par match hota hai
function normalizeDropCode(value: string): string {
  return value.trim().toLowerCase();
}

function cleanInput<T extends { pickupPostcode: string; dropCode: string }>(input: T): T {
  return { ...input, pickupPostcode: normalizePickupPostcode(input.pickupPostcode), dropCode: normalizeDropCode(input.dropCode) };
}

// Ek route + vehicle ki unique identity, duplicate check ke liye (Map/Set me key ke tor par)
function routeKey(pickupPostcode: string, dropCode: string, vehicleId: string): string {
  return pickupPostcode + "|" + dropCode + "|" + vehicleId;
}

// Vehicle id -> name aur name (lowercase) -> id. Vehicle module ki service se (repository direct nahi, CLAUDE.md rule)
async function getVehicleLookups() {
  const vehicles = await getAllVehicles();
  const nameById = new Map(vehicles.map((vehicle) => [vehicle.id, vehicle.name]));
  const idByLowerName = new Map(vehicles.map((vehicle) => [vehicle.name.toLowerCase(), vehicle.id]));
  return { nameById: nameById, idByLowerName: idByLowerName };
}

// CSV column ke naam ko vehicle ke naam se compare karne layak banata hai:
// sirf letters/numbers rakhta hai, lowercase karta hai, aakhir me "fare" hata deta hai.
// e.g. "Saloon Fare" aur "saloon_fare" dono "saloon" ban jaate hain, "Car 9" aur "car9" dono "car9"
function normalizeColumnKey(text: string): string {
  let key = text.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (key.endsWith("fare")) {
    key = key.slice(0, -"fare".length);
  }
  return key;
}

// Ek common shape jis me wide aur long, dono tarah ki CSV rows badal jaati hain
interface FlatImportRow {
  // Original CSV row number, error message me dikhane ke liye (ek row se kai entries ban sakti hain)
  rowNumber: number;
  pickup: unknown;
  drop_code: unknown;
  vehicle: string;
  fare: unknown;
}

// Long format row: apne saath "vehicle" aur "fare" column khud laati hai (e.g. manual Add ya hamara export)
function isLongFormatRow(row: Record<string, unknown>): boolean {
  return "vehicle" in row && "fare" in row;
}

// Wide format row: "pickup" aur "drop_code" ke saath har vehicle ka apna fare column hota hai
// (e.g. "saloon_fare", "estate_fare" ...). Har column jo kisi mojooda vehicle se match ho,
// uski apni entry ban jaati hai. Khaali/0 column ka matlab hai woh vehicle is route par offer nahi.
function flattenWideRow(row: Record<string, unknown>, rowNumber: number, vehicleNameByKey: Map<string, string>): FlatImportRow[] {
  const flatRows: FlatImportRow[] = [];

  for (const columnName of Object.keys(row)) {
    if (columnName === "pickup" || columnName === "drop_code") continue;

    const fareValue = row[columnName];
    if (fareValue === undefined || fareValue === null || fareValue === "" || Number(fareValue) <= 0) {
      continue;
    }

    const vehicleName = vehicleNameByKey.get(normalizeColumnKey(columnName));
    // Column kisi mojooda vehicle se match nahi hui (ya abhi tak woh vehicle bani nahi) - chhod do
    if (!vehicleName) continue;

    flatRows.push({ rowNumber: rowNumber, pickup: row.pickup, drop_code: row.drop_code, vehicle: vehicleName, fare: fareValue });
  }

  return flatRows;
}

function toFixedPriceResponse(record: FixedPriceRecord, vehicleName: string): FixedPriceResponse {
  return {
    id: record._id.toString(),
    pickupPostcode: record.pickupPostcode,
    dropCode: record.dropCode,
    vehicleId: record.vehicleId,
    vehicleName: vehicleName,
    fare: record.fare,
  };
}

export async function getAllFixedPrices(): Promise<FixedPriceResponse[]> {
  const records = await findAllFixedPrices();
  const { nameById } = await getVehicleLookups();

  return records.map((record) => toFixedPriceResponse(record, nameById.get(record.vehicleId) ?? "Unknown vehicle"));
}

// "Add fixed price" form: ek route, ek ya zyada vehicles ka fare, saath me banta hai
export async function createFixedPrices(input: CreateFixedPriceInput): Promise<FixedPriceResponse[]> {
  const cleaned = cleanInput(input);
  const { nameById } = await getVehicleLookups();

  for (const price of cleaned.prices) {
    if (!nameById.has(price.vehicleId)) {
      throw new AppError("One of the selected vehicles could not be found", 400);
    }

    const existing = await findFixedPriceByRoute(cleaned.pickupPostcode, cleaned.dropCode, price.vehicleId);
    if (existing) {
      throw new AppError(`A fixed price for ${nameById.get(price.vehicleId)} on this route already exists`, 409);
    }
  }

  const rows = cleaned.prices.map((price) => ({
    pickupPostcode: cleaned.pickupPostcode,
    dropCode: cleaned.dropCode,
    vehicleId: price.vehicleId,
    fare: price.fare,
  }));

  const created = await createManyFixedPrices(rows);
  return created.map((record) => toFixedPriceResponse(record, nameById.get(record.vehicleId) ?? "Unknown vehicle"));
}

// Edit form: ek hi row (route + ek vehicle) update hoti hai
export async function updateFixedPrice(id: string, input: FixedPriceInput): Promise<FixedPriceResponse> {
  if (!isValidObjectId(id)) {
    throw new AppError("Fixed price not found", 404);
  }

  const existingRecord = await findFixedPriceById(id);
  if (!existingRecord) {
    throw new AppError("Fixed price not found", 404);
  }

  const cleaned = cleanInput(input);
  const { nameById } = await getVehicleLookups();
  if (!nameById.has(cleaned.vehicleId)) {
    throw new AppError("The selected vehicle could not be found", 400);
  }

  const conflict = await findFixedPriceByRoute(cleaned.pickupPostcode, cleaned.dropCode, cleaned.vehicleId);
  if (conflict && conflict._id.toString() !== id) {
    throw new AppError(`A fixed price for ${nameById.get(cleaned.vehicleId)} on this route already exists`, 409);
  }

  const updated = await updateFixedPriceById(id, {
    pickupPostcode: cleaned.pickupPostcode,
    dropCode: cleaned.dropCode,
    vehicleId: cleaned.vehicleId,
    fare: cleaned.fare,
  });
  if (!updated) {
    throw new AppError("Fixed price not found", 404);
  }

  return toFixedPriceResponse(updated, nameById.get(updated.vehicleId) ?? "Unknown vehicle");
}

export async function deleteFixedPrice(id: string): Promise<void> {
  if (!isValidObjectId(id)) {
    throw new AppError("Fixed price not found", 404);
  }

  const deleted = await deleteFixedPriceById(id);
  if (!deleted) {
    throw new AppError("Fixed price not found", 404);
  }
}

export async function deleteAllFixedPrices(): Promise<void> {
  await deleteAllFixedPricesFromDb();
}

// CSV ke dono format support hote hain:
// - Long: har row ek (pickup, drop_code, vehicle, fare) hai
// - Wide: har row ek route hai, har vehicle ka apna fare column hai (e.g. "saloon_fare")
//   Column ka naam vehicle ke naam se (letters/numbers match kar ke) khud match ho jaata hai.
//
// Bade imports (e.g. 50,000 rows) fast rahen is liye: duplicate check ek hi query se (har row
// ke liye alag query nahi), aur save ek hi bulk insert se (har row ke liye alag insert nahi).
export async function importFixedPrices(rows: Record<string, unknown>[]): Promise<ImportResult> {
  const errors: ImportRowError[] = [];
  const { idByLowerName } = await getVehicleLookups();
  const vehicleNameByKey = new Map(Array.from(idByLowerName.keys()).map((lowerName) => [normalizeColumnKey(lowerName), lowerName]));

  // Pehle har CSV row ko ek common shape me badlo (wide row se ek se zyada entries ban sakti hain)
  const entries: FlatImportRow[] = [];
  for (let i = 0; i < rows.length; i++) {
    // Row number file ke hisaab se (header row 1 hai, is liye data 2 se shuru)
    const rowNumber = i + 2;
    const row = rows[i];

    if (isLongFormatRow(row)) {
      entries.push({ rowNumber: rowNumber, pickup: row.pickup, drop_code: row.drop_code, vehicle: String(row.vehicle), fare: row.fare });
    } else {
      entries.push(...flattenWideRow(row, rowNumber, vehicleNameByKey));
    }
  }

  // Jo routes database me pehle se hain, unki keys ek hi query se load kar lo
  const existingRecords = await findAllFixedPriceKeys();
  const seenKeys = new Set(existingRecords.map((record) => routeKey(record.pickupPostcode, record.dropCode, record.vehicleId)));

  // Har entry check karo (sab RAM me, koi database call nahi), jo sahi hon unhe insert ke liye rakho
  const rowsToInsert: { pickupPostcode: string; dropCode: string; vehicleId: string; fare: number }[] = [];

  for (const entry of entries) {
    const result = importFixedPricesRowSchema.safeParse(entry);

    if (!result.success) {
      const issue = result.error.issues[0];
      errors.push({ row: entry.rowNumber, message: issue.path.join(".") + ": " + issue.message });
      continue;
    }

    const vehicleId = idByLowerName.get(result.data.vehicle.trim().toLowerCase());
    if (!vehicleId) {
      errors.push({ row: entry.rowNumber, message: `vehicle: "${result.data.vehicle}" was not found` });
      continue;
    }

    const cleaned = cleanInput({ pickupPostcode: result.data.pickup, dropCode: result.data.drop_code });
    const key = routeKey(cleaned.pickupPostcode, cleaned.dropCode, vehicleId);

    if (seenKeys.has(key)) {
      errors.push({ row: entry.rowNumber, message: "A fixed price for this route and vehicle already exists" });
      continue;
    }

    // Isi file ke andar yeh route dobara na ban jaye, is liye abhi se seenKeys me daal do
    seenKeys.add(key);
    rowsToInsert.push({ pickupPostcode: cleaned.pickupPostcode, dropCode: cleaned.dropCode, vehicleId: vehicleId, fare: result.data.fare });
  }

  // Sab ek hi bulk insert se save karo (MongoDB driver khud ise chote batches me bhejta hai)
  let addedCount = 0;
  if (rowsToInsert.length > 0) {
    try {
      await bulkInsertFixedPrices(rowsToInsert);
      addedCount = rowsToInsert.length;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not save the rows";
      throw new AppError(message, 400);
    }
  }

  return { addedCount: addedCount, errors: errors };
}

// Fare engine (Phase 8) ke liye: ek route + vehicle ka fixed price dhoondo, na mile to null
export async function findFixedPrice(pickupAddress: string, dropoffAddress: string, vehicleId: string): Promise<number | null> {
  const normalizedPickupAddress = normalizePickupPostcode(pickupAddress);
  const normalizedDropoffAddress = dropoffAddress.toLowerCase();

  const candidates = await findFixedPricesByVehicle(vehicleId);
  const match = candidates.find(
    (candidate) => normalizedPickupAddress.includes(candidate.pickupPostcode) && normalizedDropoffAddress.includes(candidate.dropCode)
  );

  return match ? match.fare : null;
}
