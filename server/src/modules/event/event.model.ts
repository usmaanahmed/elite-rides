// Event ka database structure (Mongoose schema)
import { model, Schema } from "mongoose";

const eventSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    imageFileNames: { type: [String], default: [] },
  },
  { timestamps: true }
);

// Naam "EventModel" rakha hai kyun ke "Event" Node ka apna built-in naam hai
export const EventModel = model("Event", eventSchema);
