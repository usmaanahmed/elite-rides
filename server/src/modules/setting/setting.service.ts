// Settings ki business logic. Doosre modules bhi getSettings() se settings parhte hain
import { createDefaultSettings, findSettings, updateSettings as saveSettings } from "./setting.repository.js";
import { SettingsInput, SettingsRecord, SettingsResponse } from "./setting.types.js";

// Database ke extra fields (_id, createdAt...) hata kar sirf settings wapas karta hai
function toSettingsResponse(record: SettingsRecord): SettingsResponse {
  return {
    office: record.office,
    // singleRates purane documents me nahi hota, isliye missing ho to khaali rates maante hain
    pricing: {
      ...record.pricing,
      singleRates: {
        fixedPrice: record.pricing.singleRates?.fixedPrice || 0,
        mileageBands: record.pricing.singleRates?.mileageBands || [],
        slabBands: record.pricing.singleRates?.slabBands || [],
      },
    },
    // viaPrice aur petPrice purane documents me nahi hote, isliye missing ho to 0 maante hain
    extras: { ...record.extras, viaPrice: record.extras.viaPrice || 0, petPrice: record.extras.petPrice || 0 },
    general: record.general,
    discount: record.discount,
  };
}

// Settings wapas karta hai. Agar abhi tak bani nahi to default values ke saath bana deta hai
export async function getSettings(): Promise<SettingsResponse> {
  const existing = await findSettings();
  if (existing) {
    return toSettingsResponse(existing as unknown as SettingsRecord);
  }

  const created = await createDefaultSettings();
  return toSettingsResponse(created.toObject() as unknown as SettingsRecord);
}

export async function updateSettings(input: SettingsInput): Promise<SettingsResponse> {
  const saved = await saveSettings(input);
  return toSettingsResponse(saved as unknown as SettingsRecord);
}
