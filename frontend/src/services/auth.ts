import type {
  LoginAuthResponse,
  LoginCredentials,
  RegisterAuthResponse,
  RegisterUserData,
} from "@/types/auth"
import type { User } from "@/types/user"
import { api } from "./api"

export const authService = {
  async login(credentials: LoginCredentials) {
    const { data } = await api.post<LoginAuthResponse>("/auth/signin", credentials)
    return data
  },

  async register(userData: RegisterUserData) {
    const { data } = await api.post<RegisterAuthResponse>("/users", userData)
    return data
  },

  async me() {
    // TODO
    const { data } = await api.get<User>("/auth/me")
    return data
  },

  logout() {
    localStorage.removeItem("token")
  },
}
