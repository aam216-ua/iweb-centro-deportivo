import type {
  LoginAuthResponse,
  LoginCredentials,
  NoPasswordUserData,
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

  async createUserNoPassword(userData: NoPasswordUserData) {
    const { data } = await api.post<User>("/users", userData)
    return data
  },

  async updateProfile(id: string, userData: UpdateProfileData) {
    const { data } = await api.patch<User>(`/users/${id}`, userData)
    return data
  },

  async rechargeBalance(amount: number) {
    const { data } = await api.post<User>(`/users/balance`, { amount })
    return data
  },

  async updatePassword(id: string, credentials: UpdatePasswordData) {
    await api.post<void>(`/auth/reset/${id}`, credentials)
  },

  logout() {
    localStorage.removeItem("token")
    localStorage.removeItem("userId")
  },
}
