// Vehicle ke database queries (sirf queries, koi business logic nahi)
import { Vehicle } from "./vehicle.model.js";
import { CalculationFormatItem, RatesInput, VehicleInput, VehicleUpdateInput } from "./vehicle.types.js";

// Saari vehicles, displayOrder ke hisaab se sorted (kam number pehle)
export function findAllVehicles() {
  return Vehicle.find().sort({ displayOrder: 1 }).lean();
}

export function findVehicleById(id: string) {
  return Vehicle.findById(id).lean();
}

// Sab se bara TBMS ID wali vehicle (agla ID nikalne ke liye)
export function findVehicleWithHighestTbmsId() {
  return Vehicle.findOne().sort({ tbmsId: -1 }).lean();
}

// Sab se bara display order wali vehicle (nayi vehicle ko list ke aakhir me lagane ke liye)
export function findVehicleWithHighestDisplayOrder() {
  return Vehicle.findOne().sort({ displayOrder: -1 }).lean();
}

export function createVehicle(data: VehicleInput & { tbmsId: number; displayOrder: number; imageFileName: string }) {
  return Vehicle.create(data);
}

export function updateVehicleById(id: string, data: VehicleUpdateInput & { imageFileName?: string }) {
  return Vehicle.findByIdAndUpdate(id, data, { new: true }).lean();
}

export function updateVehicleRates(id: string, data: RatesInput) {
  return Vehicle.findByIdAndUpdate(id, data, { new: true }).lean();
}

// Ek saath kai vehicles ka calculation format update karo
export function updateCalculationFormats(items: CalculationFormatItem[]) {
  const operations = items.map((item) => ({
    updateOne: {
      filter: { _id: item.vehicleId },
      update: { calculationFormat: { type: item.type, value: item.value } },
    },
  }));
  return Vehicle.bulkWrite(operations);
}

export function deleteVehicleById(id: string) {
  return Vehicle.findByIdAndDelete(id).lean();
}
