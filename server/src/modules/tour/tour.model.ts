// Tour ka database structure (Mongoose schema)
import { model, Schema } from "mongoose";

// Ek vehicle ki is tour ke liye price
const tourPriceSchema = new Schema(
  {
    vehicleId: { type: String, required: true },
    price: { type: Number, required: true },
  },
  { _id: false }
);

// Itinerary ke ek din ki ek jagah
const tourPlaceSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    // Google Maps ka poora address aur map par jagah (latitude / longitude)
    address: { type: String, default: "", trim: true },
    lat: { type: Number, default: 0 },
    lng: { type: Number, default: 0 },
    description: { type: String, default: "", trim: true },
  },
  { _id: false }
);

// Itinerary ka ek din (kai jagahein)
const tourItineraryDaySchema = new Schema(
  {
    title: { type: String, default: "", trim: true },
    places: { type: [tourPlaceSchema], default: [] },
  },
  { _id: false }
);

const tourSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    startDate: { type: String, default: "" },
    endDate: { type: String, default: "" },
    durationDays: { type: Number, default: 1 },
    itinerary: { type: [tourItineraryDaySchema], default: [] },
    imageFileNames: { type: [String], default: [] },
    prices: { type: [tourPriceSchema], default: [] },
  },
  { timestamps: true }
);

export const TourModel = model("Tour", tourSchema);
