// FAQ module ke TypeScript types
import { Types } from "mongoose";

// Form se aane wali values (validation ke baad)
export interface FaqInput {
  question: string;
  answer: string;
}

// FAQ jaisi database me save hoti hai
export interface FaqRecord extends FaqInput {
  _id: Types.ObjectId;
}

// FAQ jaisi frontend ko bheji jaati hai
export interface FaqResponse extends FaqInput {
  id: string;
}
