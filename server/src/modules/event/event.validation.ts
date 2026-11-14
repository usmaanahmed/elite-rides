// Event ke input ko check karne wali Zod rules
import { z } from "zod";

const eventFields = {
  name: z.string().trim().min(2, "Event name must be at least 2 characters").max(100, "Event name must be 100 characters or fewer"),
  description: z.string().trim().max(1000, "Description must be 1000 characters or fewer").default(""),
};

export const createEventSchema = z.object(eventFields);

// Edit me purani images ke file names bhi aa sakte hain jo hatani hain ("removedImages[]" field)
export const updateEventSchema = z.object({
  ...eventFields,
  removedImages: z.array(z.string()).default([]),
});
