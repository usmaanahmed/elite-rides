// Drop down address ka database structure (Mongoose schema)
import { model, Schema } from "mongoose";

const dropdownAddressSchema = new Schema(
  {
    address: { type: String, required: true, trim: true },
    // Hamesha lowercase me save hota hai aur unique hai, e.g. "tw6", "gatwick"
    comparableValue: { type: String, required: true, trim: true, lowercase: true, unique: true },
    pickupCharge: { type: Number, required: true, default: 0 },
    dropoffCharge: { type: Number, required: true, default: 0 },
    type: { type: String, enum: ["address", "airport", "station"], default: "address" },
  },
  { timestamps: true }
);

export const DropdownAddress = model("DropdownAddress", dropdownAddressSchema);
