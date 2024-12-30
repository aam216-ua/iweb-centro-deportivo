import { useAuthStore } from "@/stores/auth"
import { storeToRefs } from "pinia"
import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router"

export async function authGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) {
  const authStore = useAuthStore()
  const { initialized } = storeToRefs(authStore)

  if (!initialized.value) {
    try {
      await authStore.checkAuth()
    } catch (error) {
      console.error("Auth check failed:", error)
    }
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({
      path: "/login",
      query: { redirect: to.fullPath },
    })
    return
  }

  if (to.meta.guestOnly && authStore.isAuthenticated) {
    next("/")
    return
  }

  next()
}
