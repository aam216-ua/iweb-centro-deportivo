import { z } from "@/lib/zod"
import { BookingTurn } from "@/types/booking"
import { toTypedSchema } from "@vee-validate/zod"

export const bookingSchema = toTypedSchema(
  z.object({
    date: z.string(),
    turn: z.nativeEnum(BookingTurn),
    venueId: z.string().uuid(),
    appointerId: z.string().uuid(),
    appointeeId: z.string().uuid(),
  }),
)
