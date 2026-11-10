// Vehicle ka database structure (Mongoose schema)
import { model, Schema } from "mongoose";

// Ek mileage band, e.g. "1 to 20 miles @ £2.50 per mile"
const mileageBandSchema = new Schema(
  {
    fromMiles: { type: Number, required: true },
    toMiles: { type: Number, required: true },
    ratePerMile: { type: Number, required: true },
  },
  { _id: false }
);

// Ek slab band, e.g. "1 to 20 miles = £50 flat"
const slabBandSchema = new Schema(
  {
    fromMiles: { type: Number, required: true },
    toMiles: { type: Number, required: true },
    price: { type: Number, required: true },
  },
  { _id: false }
);

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

    // Kam number pehle table/booking form me dikhta hai
    displayOrder: { type: Number, required: true, default: 0 },
    // Base fare, mileage/slab price ke upar jurta hai
    fixedPrice: { type: Number, required: true, default: 0 },
    // £0 matlab is vehicle ke liye hourly hire band hai
    hourlyRate: { type: Number, required: true, default: 0 },

    // Distance fare "mileage" bands se nikalni hai ya "slab" bands se
    rateType: { type: String, enum: ["mileage", "slab"], default: "mileage" },
    mileageBands: { type: [mileageBandSchema], default: [] },
    slabBands: { type: [slabBandSchema], default: [] },

    // Calculation Format: baqi vehicles ki price base vehicle (Saloon) se % ya £ zyada hoti hai
    calculationFormat: {
      type: { type: String, enum: ["percent", "fixed"], default: "fixed" },
      value: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

export const Vehicle = model("Vehicle", vehicleSchema);
