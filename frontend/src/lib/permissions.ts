import { useAuthStore } from "@/stores/auth"
import type { Permission } from "@/types/permissions"
import { rolePermissions } from "@/types/permissions"
import { Role } from "@/types/user"
import { computed } from "vue"

export function usePermissions() {
  const authStore = useAuthStore()
  const userRole = computed(() => authStore.user?.role)

  const userPermissions = computed(() => {
    if (!authStore.user) return []
    return rolePermissions[authStore.user.role] || []
  })

  const hasPermission = (permission: Permission) => {
    return userPermissions.value.includes(permission)
  }

  const hasAnyPermission = (permissions: Permission[]) => {
    return permissions.some((permission) => hasPermission(permission))
  }

  const hasAllPermissions = (permissions: Permission[]) => {
    return permissions.every((permission) => hasPermission(permission))
  }

  const hasAnyRole = (roles: Role[]) => roles.includes(userRole.value as Role)
  const isStaff = computed(() => hasAnyRole([Role.SUPERADMIN, Role.ADMIN, Role.RECEPTIONIST]))
  const isAdmin = computed(() => hasAnyRole([Role.SUPERADMIN, Role.ADMIN]))
  const isSuperAdmin = computed(() => hasAnyRole([Role.SUPERADMIN]))

  return {
    userPermissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasAnyRole,
    isStaff,
    isAdmin,
    isSuperAdmin,
  }
}
