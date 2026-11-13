// Night surcharge ke database queries (sirf queries, koi business logic nahi)
import { SurchargeNight } from "./surchargeNight.model.js";
import { SurchargeNightInput } from "./surchargeNight.types.js";

export function findAllSurchargeNights() {
  return SurchargeNight.find().sort({ createdAt: 1 }).lean();
}

export function findActiveSurchargeNights() {
  return SurchargeNight.find({ status: "active" }).lean();
}

export function createSurchargeNight(data: SurchargeNightInput) {
  return SurchargeNight.create(data);
}

export function updateSurchargeNightById(id: string, data: SurchargeNightInput) {
  return SurchargeNight.findByIdAndUpdate(id, data, { returnDocument: "after" }).lean();
}

export function deleteSurchargeNightById(id: string) {
  return SurchargeNight.findByIdAndDelete(id).lean();
}
