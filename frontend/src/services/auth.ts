import type {
  LoginAuthResponse,
  LoginCredentials,
  RegisterAuthResponse,
  RegisterUserData,
  UpdateProfileData,
  UpdatePasswordData,
} from "@/types/auth"
import type { User } from "@/types/user"
import { api } from "./api"
import { userService } from "@/services/user"

export const authService = {
  async login(credentials: LoginCredentials) {
    const { data } = await api.post<LoginAuthResponse>("/auth/signin", credentials)
    return data
  },

  async register(userData: RegisterUserData) {
    const { data } = await api.post<RegisterAuthResponse>("/users", userData)
    return data
  },

 async updateProfile(userData: UpdateProfileData) {
    const { data } = await api.patch<{}>("/auth", userData)
    return data
  },

  async updatePassword(id: string, passwordData: UpdatePasswordData) {
    const { data } = await api.patch<{}>(`/users/${id}`, passwordData)
    return data
  },

  async me() {
    const { data } = await user<User>("/auth/me")
    return data
  },

  logout() {
    localStorage.removeItem("token")
  },
}
