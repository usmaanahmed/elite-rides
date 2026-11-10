// Settings ke database queries (sirf queries, koi business logic nahi)
import { Setting } from "./setting.model.js";
import { SettingsInput } from "./setting.types.js";

// Ek hi settings document hai, isliye koi filter nahi
export function findSettings() {
  return Setting.findOne().lean();
}

// Khaali create karne par model ki default values khud lag jati hain
export function createDefaultSettings() {
  return Setting.create({});
}

export function updateSettings(input: SettingsInput) {
  return Setting.findOneAndUpdate({}, { $set: input }, { returnDocument: "after", upsert: true, setDefaultsOnInsert: true }).lean();
}
