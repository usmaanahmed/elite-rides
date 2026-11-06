// Vehicle ka database structure (Mongoose schema)
import { model, Schema } from "mongoose";

const vehicleSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    passengerCapacity: { type: Number, required: true },
    luggageCapacity: { type: Number, required: true },
    handLuggageCapacity: { type: Number, required: true },
    discountRate: { type: Number, required: true },
    returnDiscountRate: { type: Number, required: true },
    tbmsId: { type: Number, required: true, unique: true },
    imageFileName: { type: String, required: true },
  },
  { timestamps: true }
);

export const Vehicle = model("Vehicle", vehicleSchema);
