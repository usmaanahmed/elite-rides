// Admin ka database structure (sirf login ke liye istemal hota hai)
import { model, Schema } from "mongoose";

const adminSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);

export const Admin = model("Admin", adminSchema);
