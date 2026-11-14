// Airport ka database structure (Mongoose schema)
import { model, Schema } from "mongoose";

const airportSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    // Google se chuna hua address
    address: { type: String, required: true, trim: true },
    imageFileNames: { type: [String], default: [] },
  },
  { timestamps: true }
);

export const Airport = model("Airport", airportSchema);
