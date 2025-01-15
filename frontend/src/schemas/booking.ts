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

export const createUserSchema = toTypedSchema(
  z.object({
      name: z.string().trim().min(2).max(50),
      surname: z.string().trim().min(2).max(50),
    email: z.string().email(),
        phone: z
        .string()
        .trim()
        .transform((phone) => "+34 " + phone),
  })
)
