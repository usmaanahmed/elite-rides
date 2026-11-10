// Surcharge on date ke database queries (sirf queries, koi business logic nahi)
import { SurchargeDate } from "./surchargeDate.model.js";
import { SurchargeDateInput } from "./surchargeDate.types.js";

export function findAllSurchargeDates() {
  return SurchargeDate.find().sort({ date: 1 }).lean();
}

export function findActiveSurchargeDatesByDate(date: string) {
  return SurchargeDate.find({ date: date, status: "active" }).lean();
}

export function createSurchargeDate(data: SurchargeDateInput) {
  return SurchargeDate.create(data);
}

export function updateSurchargeDateById(id: string, data: SurchargeDateInput) {
  return SurchargeDate.findByIdAndUpdate(id, data, { returnDocument: "after" }).lean();
}

export function deleteSurchargeDateById(id: string) {
  return SurchargeDate.findByIdAndDelete(id).lean();
}
