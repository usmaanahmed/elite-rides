// Surcharge on date ka database structure (Mongoose schema)
import { model, Schema } from "mongoose";

const surchargeDateSchema = new Schema(
  {
    date: { type: String, required: true },
    amountType: { type: String, enum: ["fixed", "percent"], required: true },
    amount: { type: Number, required: true },
    fromTime: { type: String, default: "" },
    toTime: { type: String, default: "" },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

export const SurchargeDate = model("SurchargeDate", surchargeDateSchema);
