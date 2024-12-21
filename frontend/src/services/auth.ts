import type { AuthResponse, LoginCredentials, RegisterUserData } from "@/types/auth"
import type { User } from "@/types/user"
import { api } from "./api"

export const authService = {
  async login(credentials: LoginCredentials) {
    const { data } = await api.post<AuthResponse>("/auth/login", credentials)
    return data
  },

  async register(userData: RegisterUserData) {
    const { data } = await api.post<AuthResponse>("/auth/register", userData)
    return data
  },

  async me() {
    const { data } = await api.get<User>("/auth/me")
    return data
  },

  logout() {
    localStorage.removeItem("token")
  },
}
