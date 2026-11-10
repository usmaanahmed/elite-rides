// Night surcharge ke database queries (sirf queries, koi business logic nahi)
import { SurchargeNight } from "./surchargeNight.model.js";
import { SurchargeNightInput } from "./surchargeNight.types.js";

// Ek hi document hai, isliye koi filter nahi
export function findSurchargeNight() {
  return SurchargeNight.findOne().lean();
}

// Khaali create karne par model ki default values khud lag jati hain
export function createDefaultSurchargeNight() {
  return SurchargeNight.create({});
}

export function updateSurchargeNight(input: SurchargeNightInput) {
  return SurchargeNight.findOneAndUpdate({}, { $set: input }, { returnDocument: "after", upsert: true, setDefaultsOnInsert: true }).lean();
}
