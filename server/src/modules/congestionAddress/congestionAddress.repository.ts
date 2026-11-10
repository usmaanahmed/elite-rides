// Congestion address ke database queries (sirf queries, koi business logic nahi)
import { CongestionAddress } from "./congestionAddress.model.js";
import { CongestionAddressInput } from "./congestionAddress.types.js";

export function findAllCongestionAddresses() {
  return CongestionAddress.find().sort({ postcode: 1 }).lean();
}

export function findCongestionAddressById(id: string) {
  return CongestionAddress.findById(id).lean();
}

export function findCongestionAddressByPostcode(postcode: string) {
  return CongestionAddress.findOne({ postcode: postcode }).lean();
}

export function createCongestionAddress(data: CongestionAddressInput) {
  return CongestionAddress.create(data);
}

export function updateCongestionAddressById(id: string, data: CongestionAddressInput) {
  return CongestionAddress.findByIdAndUpdate(id, data, { new: true }).lean();
}

export function deleteCongestionAddressById(id: string) {
  return CongestionAddress.findByIdAndDelete(id).lean();
}
