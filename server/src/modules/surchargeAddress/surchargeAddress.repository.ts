// Surcharge address ke database queries (sirf queries, koi business logic nahi)
import { SurchargeAddress } from "./surchargeAddress.model.js";
import { SurchargeAddressInput } from "./surchargeAddress.types.js";

export function findAllSurchargeAddresses() {
  return SurchargeAddress.find().sort({ address: 1 }).lean();
}

export function findActiveSurchargeAddresses() {
  return SurchargeAddress.find({ status: "active" }).lean();
}

export function createSurchargeAddress(data: SurchargeAddressInput) {
  return SurchargeAddress.create(data);
}

export function updateSurchargeAddressById(id: string, data: SurchargeAddressInput) {
  return SurchargeAddress.findByIdAndUpdate(id, data, { returnDocument: "after" }).lean();
}

export function deleteSurchargeAddressById(id: string) {
  return SurchargeAddress.findByIdAndDelete(id).lean();
}
