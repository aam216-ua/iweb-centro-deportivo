import { api } from "./api"
import type { LoginCredentials, AuthResponse, User } from "./types/auth.types"

export const authService = {
  async login(credentials: LoginCredentials) {
    if (import.meta.env.VITE_USE_MOCK === "true") {
      return this.mockLogin(credentials)
    }
    const { data } = await api.post<AuthResponse>("/auth/login", credentials)
    return data
  },

  async register(userData: { email: string; password: string; name: string }) {
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

  async mockLogin(credentials: LoginCredentials): Promise<AuthResponse> {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    if (credentials.email === "test@example.com" && credentials.password === "password") {
      return {
        token: "mock-jwt-token",
        user: {
          id: 1,
          email: credentials.email,
          name: "Test User",
          roles: ["USER"],
        },
      }
    }
    throw new Error("Invalid credentials")
  },
}
