import { z } from "@/lib/zod"
import { toTypedSchema } from "@vee-validate/zod"

export const loginSchema = toTypedSchema(
  z.object({
    email: z.string().email(),
    password: z.string(),
  }),
)

export const registerSchema = toTypedSchema(
  z
    .object({
      nombre: z.string().min(2).max(50),
      apellidos: z.string().min(2).max(50),
      email: z.string().email(),
      password: z
        .string()
        .min(8)
        .regex(/[A-Z]/)
        .regex(/[a-z]/)
        .regex(/[0-9]/)
        .regex(/[!@#$%^&*]/),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Las contraseñas no coinciden",
      path: ["confirmPassword"],
    }),
)
