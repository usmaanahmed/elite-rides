// Station ke database queries (sirf queries, koi business logic nahi)
import { Station } from "./station.model.js";
import { StationInput } from "./station.types.js";

export function findAllStations() {
  return Station.find().sort({ name: 1 }).lean();
}

export function findStationById(id: string) {
  return Station.findById(id).lean();
}

export function createStation(data: StationInput & { imageFileNames: string[] }) {
  return Station.create(data);
}

export function updateStationById(id: string, data: StationInput & { imageFileNames: string[] }) {
  return Station.findByIdAndUpdate(id, data, { returnDocument: "after" }).lean();
}

export function deleteStationById(id: string) {
  return Station.findByIdAndDelete(id).lean();
}
