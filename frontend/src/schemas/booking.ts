import { z } from "@/lib/zod"
import { BookingTurn } from "@/types/booking"
import { toTypedSchema } from "@vee-validate/zod"

export const bookingSchema = toTypedSchema(
  z.object({
    date: z.string().min(1, "La fecha es requerida"),
    turn: z.nativeEnum(BookingTurn, {
      errorMap: () => ({ message: "El horario es requerido" }),
    }),
    venueId: z.string().uuid(),
    appointerId: z.string().uuid(),
    appointeeId: z.string().uuid(),
  }),
)
