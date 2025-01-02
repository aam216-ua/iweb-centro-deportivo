import { Role } from "@/types/user"

export type Permission =
  // User management
  | "users:view"
  | "users:create"
  | "users:edit"
  | "users:delete"

  // Venue management
  | "venues:view"
  | "venues:create"
  | "venues:edit"
  | "venues:delete"

  // Booking management
  | "bookings:view"
  | "bookings:create"
  | "bookings:edit"
  | "bookings:delete"
  | "bookings:view-all"

  // Activity management
  | "activities:view"

export const rolePermissions: Record<Role, Permission[]> = {
  [Role.SUPERADMIN]: [
    "users:view",
    "users:create",
    "users:edit",
    "users:delete",
    "venues:view",
    "venues:create",
    "venues:edit",
    "venues:delete",
    "bookings:view",
    "bookings:create",
    "bookings:edit",
    "bookings:delete",
    "bookings:view-all",
    "activities:view",
  ],
  [Role.ADMIN]: [
    "users:view",
    "users:create",
    "users:edit",
    "venues:view",
    "venues:create",
    "venues:edit",
    "venues:delete",
    "bookings:view",
    "bookings:create",
    "bookings:edit",
    "bookings:delete",
    "bookings:view-all",
    "activities:view",
  ],
  [Role.RECEPTIONIST]: [
    "users:view",
    "venues:view",
    "bookings:view",
    "bookings:create",
    "bookings:edit",
    "bookings:delete",
    "bookings:view-all",
    "activities:view",
  ],
  [Role.CUSTOMER]: ["venues:view", "bookings:view", "bookings:create", "activities:view"],
}

export interface RouteMetaPermissions {
  requiredPermissions?: Permission[]
  allowedRoles?: Role[]
}

declare module "vue-router" {
  interface RouteMeta {
    requiresAuth?: boolean
    guestOnly?: boolean
    permissions?: RouteMetaPermissions
  }
}
