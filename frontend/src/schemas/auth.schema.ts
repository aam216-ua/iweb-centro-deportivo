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
        .regex(/[A-Z]/, "El campo contraseña debe contener al menos una mayúscula")
        .regex(/[a-z]/, "El campo contraseña debe contener al menos una minúscula")
        .regex(/[0-9]/, "El campo contraseña debe contener al menos un número")
        .regex(/[^A-Za-z0-9]/, "El campo contraseña debe contener al menos un carácter especial"),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Las contraseñas no coinciden",
      path: ["confirmPassword"],
    }),
)
