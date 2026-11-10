// Surcharge address ka database structure (Mongoose schema)
import { model, Schema } from "mongoose";

const surchargeAddressSchema = new Schema(
  {
    address: { type: String, required: true, trim: true },
    fromTime: { type: String, required: true },
    toTime: { type: String, required: true },
    price: { type: Number, required: true },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

export const SurchargeAddress = model("SurchargeAddress", surchargeAddressSchema);
