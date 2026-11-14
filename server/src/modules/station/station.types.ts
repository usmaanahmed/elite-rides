// Station module ke TypeScript types
import { Types } from "mongoose";

// Form se aane wali values (validation ke baad)
export interface StationInput {
  name: string;
  description: string;
  address: string;
}

// Edit form me purani images me se jo hatani hain, un ke file names
export interface StationUpdateInput extends StationInput {
  removedImages: string[];
}

// Station jaisa database me save hota hai
export interface StationRecord extends StationInput {
  _id: Types.ObjectId;
  // Sirf file ke naam, e.g. ["1700000000-123.jpg"]
  imageFileNames: string[];
}

// Ek image jaisi frontend ko bheji jaati hai
export interface StationImageResponse {
  fileName: string;
  // e.g. "/uploads/stations/1700000000-123.jpg"
  url: string;
}

// Station jaisa frontend ko bheja jaata hai
export interface StationResponse extends StationInput {
  id: string;
  images: StationImageResponse[];
}
