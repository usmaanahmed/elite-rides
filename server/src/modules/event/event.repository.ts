// Event ke database queries (sirf queries, koi business logic nahi)
import { EventModel } from "./event.model.js";
import { EventInput } from "./event.types.js";

export function findAllEvents() {
  return EventModel.find().sort({ name: 1 }).lean();
}

export function findEventById(id: string) {
  return EventModel.findById(id).lean();
}

export function createEvent(data: EventInput & { imageFileNames: string[] }) {
  return EventModel.create(data);
}

export function updateEventById(id: string, data: EventInput & { imageFileNames: string[] }) {
  return EventModel.findByIdAndUpdate(id, data, { returnDocument: "after" }).lean();
}

export function deleteEventById(id: string) {
  return EventModel.findByIdAndDelete(id).lean();
}
