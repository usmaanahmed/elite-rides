// Admin module ke TypeScript types
import { Types } from "mongoose";

// Admin jaisa database me save hota hai
export interface AdminRecord {
  _id: Types.ObjectId;
  name: string;
  email: string;
  passwordHash: string;
}

// Naya admin banane ke liye chahiye hone wali values
export interface NewAdminInput {
  name: string;
  email: string;
  passwordHash: string;
}
