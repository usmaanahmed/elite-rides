// Ban address ke database queries (sirf queries, koi business logic nahi)
import { BanAddress } from "./banAddress.model.js";

export function findAllBanAddresses() {
  return BanAddress.find().sort({ createdAt: -1 }).lean();
}

export function findBanAddressByComparableValue(comparableValue: string) {
  return BanAddress.findOne({ comparableValue: comparableValue }).lean();
}

export function createBanAddress(address: string, comparableValue: string) {
  return BanAddress.create({ address: address, comparableValue: comparableValue });
}

export function deleteBanAddressById(id: string) {
  return BanAddress.findByIdAndDelete(id).lean();
}
