import type {
  LoginAuthResponse,
  LoginCredentials,
  RegisterUserData,
  UpdatePasswordData,
  UpdateProfileData,
} from "@/types/auth"
import type { User } from "@/types/user"
import { api } from "./api"

export const authService = {
  async login(credentials: LoginCredentials) {
    const { data } = await api.post<LoginAuthResponse>("/auth/signin", credentials)
    return data
  },

  async register(userData: RegisterUserData) {
    const { data } = await api.post<User>("/auth/signup", userData)
    return data
  },

  async updateProfile(id: string, userData: UpdateProfileData) {
    const { data } = await api.patch<User>(`/users/${id}`, userData)
    return data
  },

  async updatePassword(credentials: UpdatePasswordData) {
    await api.patch<void>("/auth/reset", credentials)
  },

  logout() {
    localStorage.removeItem("token")
    localStorage.removeItem("userId")
  },
}
