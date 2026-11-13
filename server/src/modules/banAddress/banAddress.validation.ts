// Ban address ke input ko check karne wali Zod rules
import { z } from "zod";

export const banAddressSchema = z.object({
  address: z.string().trim().min(1, "Address is required").max(200, "Address must be 200 characters or fewer"),
});
