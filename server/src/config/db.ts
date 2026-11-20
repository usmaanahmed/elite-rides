// MongoDB se connection (mongoose)
import mongoose from "mongoose";
import { env } from "./env.js";
import { DropdownAddress } from "../modules/dropdownAddress/dropdownAddress.model.js";

export async function connectDB(): Promise<void> {
  try {
    await mongoose.connect(env.mongoUri);
    console.log("MongoDB connected");
    // Purana unique index (comparableValue_1) database se hata do, taake duplicate values save ho sakein
    await DropdownAddress.syncIndexes();
  } catch (error) {
    console.log("MongoDB connection failed:", error);
    process.exit(1);
  }
}
