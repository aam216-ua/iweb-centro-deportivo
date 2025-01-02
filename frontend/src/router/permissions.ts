import type { RouteMetaPermissions } from "@/types/permissions"
import { Role } from "@/types/user"

export const routePermissions: Record<string, RouteMetaPermissions> = {
  users: {
    requiredPermissions: ["users:view"],
    allowedRoles: [Role.SUPERADMIN, Role.ADMIN, Role.RECEPTIONIST],
  },
  venues: {
    requiredPermissions: ["venues:view"],
    allowedRoles: [Role.SUPERADMIN, Role.ADMIN, Role.RECEPTIONIST, Role.CUSTOMER],
  },
  bookings: {
    requiredPermissions: ["bookings:view"],
    allowedRoles: [Role.SUPERADMIN, Role.ADMIN, Role.RECEPTIONIST, Role.CUSTOMER],
  },
  profile: {
    requiredPermissions: [],
    allowedRoles: [Role.SUPERADMIN, Role.ADMIN, Role.RECEPTIONIST, Role.CUSTOMER],
  },
  dashboard: {
    requiredPermissions: [],
    allowedRoles: [Role.SUPERADMIN, Role.ADMIN, Role.RECEPTIONIST],
  },
}
