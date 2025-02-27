import { authService } from "@/services/auth"
import { usersService } from "@/services/user"
import type {
  LoginCredentials,
  NoPasswordUserData,
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
      delete userData["confirmPassword"]
      return await authService.register(userData)
    } finally {
      loading.value = false
    }
  }

  async function createUserNoPassword(userData: NoPasswordUserData) {
    loading.value = true
    error.value = null
    try {
      return await authService.createUserNoPassword(userData)
    } finally {
      loading.value = false
    }
  }

  async function rechargeBalance(amount: number) {
    if (!user.value?.id) throw new Error("User not authenticated")
    loading.value = true
    error.value = null
    try {
      const updatedUser = await authService.rechargeBalance(amount)
      user.value = updatedUser
    } catch (err) {
      error.value = "No se pudo recargar el saldo"
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateProfile(userData: UpdateProfileData, id: string) {
    if (!user.value?.id) throw new Error("User not authenticated")
    loading.value = true
    error.value = null
    try {
      await authService.updateProfile(id, userData)
    } catch (err) {
      error.value = "No se pudo actualizar el perfil"
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updatePassword(credentials: UpdatePasswordData) {
    if (!user.value?.id) throw new Error("User not authenticated")
    loading.value = true
    error.value = null
    try {
      await authService.updatePassword(user.value.id, credentials)
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
      const userData = await usersService.get(storedUserId)
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
      const userData = await usersService.get(userId.value)
      user.value = userData
    } catch (err) {
      const error = err as AxiosError
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
    createUserNoPassword,
    rechargeBalance,
  }
})
