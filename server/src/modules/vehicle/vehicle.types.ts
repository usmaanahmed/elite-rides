// Vehicle module ke TypeScript types
import { Types } from "mongoose";

// Form se aane wali values (validation ke baad)
export interface VehicleInput {
  name: string;
  description: string;
  passengerCapacity: number;
  luggageCapacity: number;
  handLuggageCapacity: number;
  // Percentage, e.g. 10 matlab 10% discount
  discountRate: number;
  returnDiscountRate: number;
}

// Vehicle jaisa database me save hota hai
export interface VehicleRecord extends VehicleInput {
  _id: Types.ObjectId;
  tbmsId: number;
  // Sirf file ka naam, e.g. "1700000000-123.jpg"
  imageFileName: string;
}

// Vehicle jaisa frontend ko bheja jaata hai
export interface VehicleResponse extends VehicleInput {
  id: string;
  tbmsId: string;
  // e.g. "/uploads/vehicles/1700000000-123.jpg"
  imageUrl: string;
}
