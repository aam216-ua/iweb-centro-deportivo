import type { User } from "@/types/user"

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterUserData {
  email: string
  name: string
  surname: string
  password: string
  confirmPassword: string
  phone: string
}

export interface UpdateUserData {
  email: string
  name: string
  surname: string
  phone: string
}

export interface LoginAuthResponse {
  token: string
  user: User
}

export interface RegisterAuthResponse {
  token: string
  user: User
}
