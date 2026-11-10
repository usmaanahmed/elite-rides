// Night surcharge ka database structure. Poori company ke liye sirf ek document hota hai
import { model, Schema } from "mongoose";

const surchargeNightSchema = new Schema(
  {
    startTime: { type: String, default: "22:00" },
    endTime: { type: String, default: "06:00" },
    amountType: { type: String, enum: ["fixed", "percent"], default: "fixed" },
    amount: { type: Number, default: 0 },
    status: { type: String, enum: ["active", "inactive"], default: "inactive" },
  },
  { timestamps: true }
);

export const SurchargeNight = model("SurchargeNight", surchargeNightSchema);
