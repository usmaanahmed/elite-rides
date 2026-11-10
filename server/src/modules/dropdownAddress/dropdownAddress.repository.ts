// Drop down address ke database queries (sirf queries, koi business logic nahi)
import { DropdownAddress } from "./dropdownAddress.model.js";
import { DropdownAddressInput } from "./dropdownAddress.types.js";

export function findAllDropdownAddresses() {
  return DropdownAddress.find().sort({ address: 1 }).lean();
}

export function findDropdownAddressById(id: string) {
  return DropdownAddress.findById(id).lean();
}

export function findDropdownAddressByComparableValue(comparableValue: string) {
  return DropdownAddress.findOne({ comparableValue: comparableValue }).lean();
}

export function createDropdownAddress(data: DropdownAddressInput) {
  return DropdownAddress.create(data);
}

export function updateDropdownAddressById(id: string, data: DropdownAddressInput) {
  return DropdownAddress.findByIdAndUpdate(id, data, { new: true }).lean();
}

export function deleteDropdownAddressById(id: string) {
  return DropdownAddress.findByIdAndDelete(id).lean();
}
