// Event module ke TypeScript types
import { Types } from "mongoose";

// Form se aane wali values (validation ke baad)
export interface EventInput {
  name: string;
  description: string;
}

// Edit form me purani images me se jo hatani hain, un ke file names
export interface EventUpdateInput extends EventInput {
  removedImages: string[];
}

// Event jaisa database me save hota hai
export interface EventRecord extends EventInput {
  _id: Types.ObjectId;
  // Sirf file ke naam, e.g. ["1700000000-123.jpg"]
  imageFileNames: string[];
}

// Ek image jaisi frontend ko bheji jaati hai
export interface EventImageResponse {
  fileName: string;
  // e.g. "/uploads/events/1700000000-123.jpg"
  url: string;
}

// Event jaisa frontend ko bheja jaata hai
export interface EventResponse extends EventInput {
  id: string;
  images: EventImageResponse[];
}
