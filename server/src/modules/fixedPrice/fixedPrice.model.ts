// Fixed price ka database structure (Mongoose schema). Ek row = ek route ka ek vehicle ka fare.
import { model, Schema } from "mongoose";

const fixedPriceSchema = new Schema(
  {
    // Spaces hata kar, uppercase me save hota hai, e.g. "LU13QF" ya "LU1"
    pickupPostcode: { type: String, required: true, trim: true },
    // Lowercase keyword, customer ke drop-off address me dhoonda jaata hai, e.g. "heathrow"
    dropCode: { type: String, required: true, trim: true },
    vehicleId: { type: String, required: true },
    fare: { type: Number, required: true },
  },
  { timestamps: true }
);

// Ek route par ek vehicle ka sirf ek hi fare ho sakta hai
fixedPriceSchema.index({ pickupPostcode: 1, dropCode: 1, vehicleId: 1 }, { unique: true });

export const FixedPrice = model("FixedPrice", fixedPriceSchema);
