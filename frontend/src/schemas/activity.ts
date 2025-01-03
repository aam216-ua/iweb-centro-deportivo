import { z } from "@/lib/zod"
import { toTypedSchema } from "@vee-validate/zod"

export const activitySchema = toTypedSchema(
  z.object({
    name: z.string().trim().min(2).max(50),
  }),
)
