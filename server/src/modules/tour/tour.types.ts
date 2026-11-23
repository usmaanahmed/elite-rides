// Tour module ke TypeScript types
import { Types } from "mongoose";

// Ek vehicle ki is tour ke liye price, e.g. { vehicleId: "abc", price: 250 }
export interface TourPrice {
  vehicleId: string;
  price: number;
}

// Ek din ki ek jagah (Google Maps se chuni hui), e.g.
// { name: "Stonehenge", address: "Salisbury SP4 7DE, UK", lat: 51.17, lng: -1.82, description: "Guided visit" }
export interface TourPlace {
  name: string;
  address: string;
  lat: number;
  lng: number;
  description: string;
}

// Itinerary ka ek din (din ka number list ki position se banta hai: pehla = Day 1)
export interface TourItineraryDay {
  title: string;
  places: TourPlace[];
}

// Form se aane wali values (validation ke baad)
export interface TourInput {
  title: string;
  description: string;
  // "YYYY-MM-DD" ya khali text ("" = date set nahi)
  startDate: string;
  endDate: string;
  durationDays: number;
  itinerary: TourItineraryDay[];
  prices: TourPrice[];
}

// Edit form me purani images me se jo hatani hain, un ke file names
export interface TourUpdateInput extends TourInput {
  removedImages: string[];
}

// Tour jaisa database me save hota hai
export interface TourRecord extends TourInput {
  _id: Types.ObjectId;
  // Sirf file ke naam, e.g. ["1700000000-123.jpg"]
  imageFileNames: string[];
}

// Ek image jaisi frontend ko bheji jaati hai
export interface TourImageResponse {
  fileName: string;
  // e.g. "/uploads/tours/1700000000-123.jpg"
  url: string;
}

// Tour jaisa admin panel ko bheja jaata hai
export interface TourResponse extends TourInput {
  id: string;
  images: TourImageResponse[];
}
