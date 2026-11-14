// Station ke input ko check karne wali Zod rules
import { z } from "zod";

const stationFields = {
  name: z.string().trim().min(2, "Station name must be at least 2 characters").max(100, "Station name must be 100 characters or fewer"),
  description: z.string().trim().max(1000, "Description must be 1000 characters or fewer").default(""),
  address: z.string().trim().min(1, "Enter the station address").max(300, "Address must be 300 characters or fewer"),
};

export const createStationSchema = z.object(stationFields);

// Edit me purani images ke file names bhi aa sakte hain jo hatani hain ("removedImages[]" field)
export const updateStationSchema = z.object({
  ...stationFields,
  removedImages: z.array(z.string()).default([]),
});
