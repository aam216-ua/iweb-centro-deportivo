import { VenueStatus } from "@/types/venue"
import { toTypedSchema } from "@vee-validate/zod"
import { z } from "zod"

export const venueSchema = toTypedSchema(
  z.object({
    name: z.string().trim().min(2).max(50),
    description: z.string().trim(),
    capacity: z.number().positive().lte(200),
    fee: z.number().positive().lte(9999.99),
    activityId: z.string().uuid(),
    status: z.nativeEnum(VenueStatus),
  }),
)
