import { z } from "@/lib/zod"
import { TimeSlots } from "@/types/reserve"
import { toTypedSchema } from "@vee-validate/zod"

export const reserveSchema = toTypedSchema(
  z.object({
    date: z.string().refine(
      (date) => {
        const selectedDate = new Date(date)
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        tomorrow.setHours(0, 0, 0, 0)

        const maxDate = new Date(tomorrow)
        maxDate.setDate(maxDate.getDate() + 14)

        return selectedDate >= tomorrow && selectedDate <= maxDate
      },
      {
        message: "La fecha debe estar entre mañana y los próximos 15 días",
      },
    ),
    time: z.enum(
      Object.keys(TimeSlots) as [keyof typeof TimeSlots, ...(keyof typeof TimeSlots)[]],
    ),
  }),
)
