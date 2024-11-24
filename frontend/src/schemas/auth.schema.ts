import { z } from "@/lib/zod"
import { toTypedSchema } from "@vee-validate/zod"

export const loginSchema = toTypedSchema(
  z.object({
    email: z.string().email(),
    password: z.string().trim(),
  }),
)

export const registerSchema = toTypedSchema(
  z
    .object({
      nombre: z.string().trim().min(2).max(50),
      apellidos: z.string().trim().min(2).max(50),
      email: z.string().email(),
      password: z
        .string()
        .min(8)
        .max(64)
        .regex(/[A-Z]/)
        .regex(/[a-z]/)
        .regex(/[0-9]/)
        .regex(/[!@#$%^&*]/)
        .regex(/^[A-Za-z0-9!@#$%^&*]+$/),
      confirmPassword: z.string(),
      telefono: z.string().trim(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Las contraseñas no coinciden",
      path: ["confirmPassword"],
    }),
)
