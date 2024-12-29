import { authService } from "@/services/auth"
import type { LoginCredentials, RegisterUserData, UpdateProfileData,UpdatePasswordData } from "@/types/auth"
import type { User } from "@/types/user"
import { defineStore } from "pinia"
import { computed, ref } from "vue"

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem("token"))
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value)

  async function login(credentials: LoginCredentials) {
    loading.value = true
    error.value = null
    try {
      const response = await authService.login(credentials)
      token.value = response.token
      user.value = response.user

      localStorage.setItem("token", response.token)
    } catch (err) {
      error.value = "Credenciales inválidas"
      throw err
    } finally {
      loading.value = false
    }
  }

  async function register(userData: RegisterUserData) {
    loading.value = true
    error.value = null
    try {
      const response = await authService.register(userData)
      return response
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    authService.logout()
    user.value = null
    token.value = null
  }

  async function checkAuth() {
    if (!token.value) return
    try {
      user.value = await authService.me()
    } catch {
      logout()
    }
  }

  async function updateProfile(userData: UpdateProfileData) {
    loading.value = true
    error.value = null
      }

  async function updatePassword(newPassword: string) {
    loading.value = true
    error.value = null
    try {
      await authService.updatePassword(newPassword)
    } catch (err) {
      error.value = "No se pudo actualizar la contraseña"
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    checkAuth,
    updateProfile,
    updatePassword,
  }
})
