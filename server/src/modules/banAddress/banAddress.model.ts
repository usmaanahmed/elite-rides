// Ban address ka database structure (Mongoose schema)
import { model, Schema } from "mongoose";

const banAddressSchema = new Schema(
  {
    address: { type: String, required: true, trim: true },
    // Match karne ke liye lowercase copy (customer ka address bhi lowercase karke compare hota hai)
    comparableValue: { type: String, required: true, trim: true, lowercase: true, unique: true },
  },
  { timestamps: true }
);

export const BanAddress = model("BanAddress", banAddressSchema);
