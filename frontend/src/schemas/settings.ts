import { z } from "@/lib/zod"
import { toTypedSchema } from "@vee-validate/zod"

export const settingsSchema = toTypedSchema(
  z.object({
    email: z.string().email(),
    name: z.string().trim().min(2).max(50),
    surname: z.string().trim().min(2).max(50),
    phone: z
      .string()
      .trim()
      .transform((phone) => "+34 " + phone),
  }),
)

export const passwordSchema = toTypedSchema(
  z
    .object({
      password: z.string().trim(),
      newPassword: z
        .string()
        .min(8)
        .max(64)
        .regex(/[A-Z]/)
        .regex(/[a-z]/)
        .regex(/[0-9]/)
        .regex(/[!@#$%^&*]/)
        .regex(/^[A-Za-z0-9!@#$%^&*]+$/),
      confirmPassword: z.string().trim(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: "Las contraseñas no coinciden",
      path: ["confirmPassword"],
    })
    .refine((data) => data.newPassword !== data.password, {
      message: "La nueva contraseña debe ser distinta a la anterior",
      path: ["newPassword"],
    }),
)
