// Airport ke database queries (sirf queries, koi business logic nahi)
import { Airport } from "./airport.model.js";
import { AirportInput } from "./airport.types.js";

export function findAllAirports() {
  return Airport.find().sort({ name: 1 }).lean();
}

export function findAirportById(id: string) {
  return Airport.findById(id).lean();
}

export function createAirport(data: AirportInput & { imageFileNames: string[] }) {
  return Airport.create(data);
}

export function updateAirportById(id: string, data: AirportInput & { imageFileNames: string[] }) {
  return Airport.findByIdAndUpdate(id, data, { returnDocument: "after" }).lean();
}

export function deleteAirportById(id: string) {
  return Airport.findByIdAndDelete(id).lean();
}
