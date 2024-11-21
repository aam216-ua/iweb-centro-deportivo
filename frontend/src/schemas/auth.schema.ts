import { toTypedSchema } from "@vee-validate/zod"
import { z } from "zod"

export const loginSchema = toTypedSchema(
  z.object({
    email: z.string().min(1, "El email es requerido").email("Formato de email inválido"),
    password: z.string(),
  }),
)

export const registerSchema = toTypedSchema(
  z
    .object({
      nombre: z
        .string()
        .min(2, "El nombre debe tener al menos 2 caracteres")
        .max(50, "El nombre no puede tener más de 50 caracteres"),
      apellido: z
        .string()
        .min(2, "El apellido debe tener al menos 2 caracteres")
        .max(50, "El apellido no puede tener más de 50 caracteres"),
      email: z.string().min(1, "El email es requerido").email("Formato de email inválido"),
      password: z
        .string()
        .min(8, "La contraseña debe tener al menos 8 caracteres")
        .regex(/[A-Z]/, "Debe contener al menos una mayúscula")
        .regex(/[a-z]/, "Debe contener al menos una minúscula")
        .regex(/[0-9]/, "Debe contener al menos un número")
        .regex(/[^A-Za-z0-9]/, "Debe contener al menos un carácter especial"),
      confirmPassword: z.string().min(1, "Por favor confirma tu contraseña"),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Las contraseñas no coinciden",
      path: ["confirmPassword"],
    }),
)
