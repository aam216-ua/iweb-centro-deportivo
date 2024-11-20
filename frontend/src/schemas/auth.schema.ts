import { z } from "zod"
import { toTypedSchema } from "@vee-validate/zod"

export const loginSchema = toTypedSchema(
  z.object({
    email: z.string().min(1, "El email es requerido").email("Formato de email inválido"),
    password: z.string(),
  }),
)

export const registerSchema = toTypedSchema(
  z
    .object({
      email: z.string().min(1, "El email es requerido").email("Formato de email inválido"),
      password: z
        .string()
        .min(8, "La contraseña debe tener al menos 8 caracteres")
        .regex(/[A-Z]/, "Debe contener al menos una mayúscula")
        .regex(/[a-z]/, "Debe contener al menos una minúscula")
        .regex(/[0-9]/, "Debe contener al menos un número")
        .regex(/[^A-Za-z0-9]/, "Debe contener al menos un carácter especial"),
      confirmPassword: z.string().min(1, "Por favor confirma tu contraseña"),
      nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Las contraseñas no coinciden",
      path: ["confirmPassword"],
    }),
)
