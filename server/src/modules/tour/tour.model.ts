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

const tourSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    imageFileNames: { type: [String], default: [] },
    prices: { type: [tourPriceSchema], default: [] },
  },
  { timestamps: true }
);

export const TourModel = model("Tour", tourSchema);
