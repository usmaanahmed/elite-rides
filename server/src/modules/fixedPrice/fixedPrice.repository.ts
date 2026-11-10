// Fixed price ke database queries (sirf queries, koi business logic nahi)
import { FixedPrice } from "./fixedPrice.model.js";

export function findAllFixedPrices() {
  return FixedPrice.find().sort({ pickupPostcode: 1, dropCode: 1 }).lean();
}

export function findFixedPriceById(id: string) {
  return FixedPrice.findById(id).lean();
}

export function findFixedPriceByRoute(pickupPostcode: string, dropCode: string, vehicleId: string) {
  return FixedPrice.findOne({ pickupPostcode: pickupPostcode, dropCode: dropCode, vehicleId: vehicleId }).lean();
}

// Fare engine (Phase 8) ke liye: ek vehicle ki saari fixed price routes
export function findFixedPricesByVehicle(vehicleId: string) {
  return FixedPrice.find({ vehicleId: vehicleId }).lean();
}

// Import ke waqt duplicate check fast karne ke liye: saari mojooda routes ki sirf 3 fields
// (poori document nahi), taake bade imports (e.g. 50k rows) ek hi query se check ho jayen
export function findAllFixedPriceKeys() {
  return FixedPrice.find().select("pickupPostcode dropCode vehicleId").lean();
}

export function createFixedPrice(data: { pickupPostcode: string; dropCode: string; vehicleId: string; fare: number }) {
  return FixedPrice.create(data);
}

export function createManyFixedPrices(rows: { pickupPostcode: string; dropCode: string; vehicleId: string; fare: number }[]) {
  return FixedPrice.insertMany(rows);
}

// CSV import ke liye: bade batches (e.g. 50k rows) ke liye tez insert.
// ordered:false matlab Mongo ek row fail hone par ruke nahi, baqi daalta rahe;
// lean:true matlab Mongoose har row ka poora Document object na banaye (sirf validate + save)
export function bulkInsertFixedPrices(rows: { pickupPostcode: string; dropCode: string; vehicleId: string; fare: number }[]) {
  return FixedPrice.insertMany(rows, { ordered: false, lean: true });
}

export function updateFixedPriceById(id: string, data: { pickupPostcode: string; dropCode: string; vehicleId: string; fare: number }) {
  return FixedPrice.findByIdAndUpdate(id, data, { new: true }).lean();
}

export function deleteFixedPriceById(id: string) {
  return FixedPrice.findByIdAndDelete(id).lean();
}

export function deleteAllFixedPrices() {
  return FixedPrice.deleteMany({});
}
