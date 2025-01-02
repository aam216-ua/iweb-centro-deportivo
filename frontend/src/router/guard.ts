import { usePermissions } from "@/lib/permissions"
import { useAuthStore } from "@/stores/auth"
import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router"

export async function authGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) {
  const authStore = useAuthStore()
  const { hasAllPermissions } = usePermissions()

  if (!authStore.initialized) {
    try {
      await authStore.checkAuth()
    } catch (error) {
      console.error("Auth check failed:", error)
      authStore.logout()
      next({
        path: "/login",
        query: { redirect: to.fullPath },
      })
      return
    }
  }

  if (to.name !== from.name) {
    await authStore.refreshUser()
  }
  if (to.meta.guestOnly && authStore.isAuthenticated) {
    next("/")
    return
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({
      path: "/login",
      query: { redirect: to.fullPath },
    })
    return
  }

  if (to.meta.permissions && authStore.isAuthenticated && authStore.user) {
    const { allowedRoles, requiredPermissions } = to.meta.permissions

    if (allowedRoles && !allowedRoles.includes(authStore.user.role)) {
      next({
        path: "/",
        query: {
          error: "insufficient_permissions",
        },
      })
      return
    }

    if (requiredPermissions && !hasAllPermissions(requiredPermissions)) {
      next({
        path: "/",
        query: {
          error: "insufficient_permissions",
        },
      })
      return
    }
  }

  next()
}
