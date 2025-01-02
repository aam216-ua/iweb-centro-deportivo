import { authService } from "@/services/auth"
import { userService } from "@/services/user"
import type {
  LoginCredentials,
  RegisterUserData,
  UpdatePasswordData,
  UpdateProfileData,
} from "@/types/auth"
import type { User } from "@/types/user"
import type { AxiosError } from "axios"
import { defineStore } from "pinia"
import { computed, ref } from "vue"

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const userId = ref<string | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const initialized = ref(false)

  const isAuthenticated = computed(() => Boolean(token.value && user.value))

  async function login(credentials: LoginCredentials) {
    loading.value = true
    error.value = null
    try {
      const response = await authService.login(credentials)
      token.value = response.token
      user.value = response.user
      userId.value = String(response.user.id)
      localStorage.setItem("token", response.token)
      localStorage.setItem("userId", String(response.user.id))
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
      return await authService.register(userData)
    } finally {
      loading.value = false
    }
  }

  async function updateProfile(userData: UpdateProfileData) {
    if (!user.value?.id) throw new Error("User not authenticated")
    loading.value = true
    error.value = null
    try {
      await authService.updateProfile(String(user.value.id), userData)
    } catch (err) {
      error.value = "No se pudo actualizar el perfil"
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updatePassword(credentials: UpdatePasswordData) {
    loading.value = true
    error.value = null
    try {
      await authService.updatePassword(credentials)
    } catch (err) {
      error.value = "No se pudo actualizar la contraseña"
      throw err
    } finally {
      loading.value = false
    }
  }

  function logout() {
    authService.logout()
    user.value = null
    token.value = null
    userId.value = null
    localStorage.removeItem("token")
    localStorage.removeItem("userId")
  }

  async function checkAuth() {
    const storedToken = localStorage.getItem("token")
    const storedUserId = localStorage.getItem("userId")

    if (!storedToken || !storedUserId) {
      logout()
      initialized.value = true
      return
    }

    try {
      loading.value = true
      token.value = storedToken
      userId.value = storedUserId
      const userData = await userService.get(storedUserId)
      user.value = userData
    } catch (error) {
      logout()
      throw error
    } finally {
      loading.value = false
      initialized.value = true
    }
  }

  async function refreshUser() {
    if (!userId.value || !isAuthenticated.value) return

    try {
      const userData = await userService.get(userId.value)
      user.value = userData
    } catch (err) {
      const error = err as AxiosError
      if (error.response?.status === 401) {
        logout()
      }
      throw error
    }
  }

  return {
    user,
    token,
    loading,
    error,
    initialized,
    isAuthenticated,
    login,
    register,
    logout,
    checkAuth,
    updateProfile,
    updatePassword,
    refreshUser,
  }
})
