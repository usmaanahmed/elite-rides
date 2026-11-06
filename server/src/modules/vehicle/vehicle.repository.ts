// Vehicle ke database queries (sirf queries, koi business logic nahi)
import { Vehicle } from "./vehicle.model.js";
import { VehicleInput } from "./vehicle.types.js";

// Saari vehicles, purani pehle
export function findAllVehicles() {
  return Vehicle.find().sort({ createdAt: 1 }).lean();
}

export function findVehicleById(id: string) {
  return Vehicle.findById(id).lean();
}

// Sab se bara TBMS ID wali vehicle (agla ID nikalne ke liye)
export function findVehicleWithHighestTbmsId() {
  return Vehicle.findOne().sort({ tbmsId: -1 }).lean();
}

export function createVehicle(data: VehicleInput & { tbmsId: number; imageFileName: string }) {
  return Vehicle.create(data);
}

export function deleteVehicleById(id: string) {
  return Vehicle.findByIdAndDelete(id).lean();
}
