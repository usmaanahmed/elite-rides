// Congestion address ka database structure (Mongoose schema)
import { model, Schema } from "mongoose";

const congestionAddressSchema = new Schema(
  {
    // Uppercase me, bina spaces ke save hota hai, e.g. "EC1"
    postcode: { type: String, required: true, trim: true, uppercase: true, unique: true },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

export const CongestionAddress = model("CongestionAddress", congestionAddressSchema);
