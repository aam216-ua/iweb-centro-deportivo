import type { User } from "@/types/user"

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterUserData {
  email: string
  nombre: string
  apellidos: string
  password: string
  confirmPassword: string
  telefono: string
}

export interface Facility {
  id: number
  nombre: string
  precio: number
}

export interface AuthResponse {
  token: string
  user: User
}
