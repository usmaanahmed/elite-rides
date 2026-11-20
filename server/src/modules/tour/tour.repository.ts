// Tour ke database queries (sirf queries, koi business logic nahi)
import { TourModel } from "./tour.model.js";
import { TourInput } from "./tour.types.js";

export function findAllTours() {
  return TourModel.find().sort({ createdAt: -1 }).lean();
}

export function findTourById(id: string) {
  return TourModel.findById(id).lean();
}

export function createTour(data: TourInput & { imageFileNames: string[] }) {
  return TourModel.create(data);
}

export function updateTourById(id: string, data: TourInput & { imageFileNames: string[] }) {
  return TourModel.findByIdAndUpdate(id, data, { returnDocument: "after" }).lean();
}

export function deleteTourById(id: string) {
  return TourModel.findByIdAndDelete(id).lean();
}
