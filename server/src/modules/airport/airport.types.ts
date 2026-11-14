// Airport module ke TypeScript types
import { Types } from "mongoose";

// Form se aane wali values (validation ke baad)
export interface AirportInput {
  name: string;
  description: string;
  address: string;
}

// Edit form me purani images me se jo hatani hain, un ke file names
export interface AirportUpdateInput extends AirportInput {
  removedImages: string[];
}

// Airport jaisa database me save hota hai
export interface AirportRecord extends AirportInput {
  _id: Types.ObjectId;
  // Sirf file ke naam, e.g. ["1700000000-123.jpg"]
  imageFileNames: string[];
}

// Ek image jaisi frontend ko bheji jaati hai
export interface AirportImageResponse {
  fileName: string;
  // e.g. "/uploads/airports/1700000000-123.jpg"
  url: string;
}

// Airport jaisa frontend ko bheja jaata hai
export interface AirportResponse extends AirportInput {
  id: string;
  images: AirportImageResponse[];
}
