// Ban address ke input ko check karne wali Zod rules
import { z } from "zod";

export const banAddressSchema = z.object({
  address: z.string().trim().min(5, "Address must be at least 5 characters").max(200, "Address must be 200 characters or fewer"),
});
