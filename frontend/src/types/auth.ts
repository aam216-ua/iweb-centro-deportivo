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
  phone: string
}

export interface UpdateProfileData {
  email?: string
  name?: string
  surname?: string
  phone?: string
}

export interface UpdatePasswordData {
  email: string
  password: string
  newPassword: string
}

export interface LoginAuthResponse {
  token: string
  user: User
}
