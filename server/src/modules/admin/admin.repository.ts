// Admin ke database queries (sirf queries, koi business logic nahi)
import { Admin } from "./admin.model.js";
import { NewAdminInput } from "./admin.types.js";

export function findAdminByEmail(email: string) {
  return Admin.findOne({ email }).lean();
}

export function findAdminById(id: string) {
  return Admin.findById(id).lean();
}

export function createAdmin(data: NewAdminInput) {
  return Admin.create(data);
}
