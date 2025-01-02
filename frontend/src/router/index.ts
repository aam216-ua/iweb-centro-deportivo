import EmptyLayout from "@/layouts/EmptyLayout.vue"
import MainLayout from "@/layouts/MainLayout.vue"
import SecondaryLayout from "@/layouts/SecondaryLayout.vue"
import { authGuard } from "@/router/guard"
import { Role } from "@/types/user"
import type { RouteRecordRaw } from "vue-router"
import { createRouter, createWebHistory } from "vue-router"
import { routePermissions } from "./permissions"

const publicRoutes: RouteRecordRaw = {
  path: "/",
  component: MainLayout,
  children: [
    {
      path: "",
      name: "home",
      component: () => import("@/views/HomeView.vue"),
    },
    //{
    //  path: "venues",
    //  name: "venues",
    //  component: () => import("@/views/venues/VenuesView.vue"),
    //  meta: {
    //    permissions: routePermissions.venues
    //  }
    //},
    //{
    //  path: "venues/:id",
    //  name: "venue-details",
    //  component: () => import("@/views/venues/VenueDetailsView.vue"),
    //  meta: {
    //    permissions: routePermissions.venues
    //  }
    //}
  ],
}

const authRoutes: RouteRecordRaw = {
  path: "/",
  component: EmptyLayout,
  children: [
    {
      path: "login",
      name: "login",
      component: () => import("@/views/auth/LoginView.vue"),
      meta: { guestOnly: true },
    },
    {
      path: "register",
      name: "register",
      component: () => import("@/views/auth/RegisterView.vue"),
      meta: { guestOnly: true },
    },
  ],
}

const protectedRoutes: RouteRecordRaw = {
  path: "/",
  component: SecondaryLayout,
  meta: { requiresAuth: true },
  children: [
    {
      path: "profile",
      name: "profile",
      component: () => import("@/views/ProfileView.vue"),
      meta: {
        permissions: routePermissions.profile,
      },
    },
    {
      path: "settings",
      name: "settings",
      component: () => import("@/views/SettingsView.vue"),
      meta: {
        requiresAuth: true,
      },
      },
     {
      path: "dashboard",
      name: "dashboard",
      component: () => import("@/views/DashboardView.vue"),
      meta: {
        requiresAuth: true,
        permissions: routePermissions.dashboard
      },
    },
    //{
    //  path: "bookings",
    //  name: "bookings",
    //  component: () => import("@/views/bookings/BookingsView.vue"),
    //  meta: {
    //    permissions: routePermissions.bookings
    //  }
    //},
    //{
    //  path: "bookings/:id",
    //  name: "booking-details",
    //  component: () => import("@/views/bookings/BookingDetailsView.vue"),
    //  meta: {
    //    permissions: routePermissions.bookings
    //  }
    //},
    //{
    //  path: "bookings/create",
    //  name: "create-booking",
    //  component: () => import("@/views/bookings/CreateBookingView.vue"),
    //  meta: {
    //    permissions: {
    //      requiredPermissions: ['bookings:create'],
    //      allowedRoles: ['superadmin', 'admin', 'receptionist', 'customer']
    //    }
    //  }
    //},
    //{
    //  path: "users",
    //  name: "users",
    //  component: () => import("@/views/users/UsersView.vue"),
    //  meta: {
    //    permissions: routePermissions.users
    //  }
    //},
    //{
    //  path: "users/:id",
    //  name: "user-details",
    //  component: () => import("@/views/users/UserDetailsView.vue"),
    //  meta: {
    //    permissions: routePermissions.users
    //  }
    //},
  ],
}

const adminRoutes: RouteRecordRaw = {
  path: "/admin",
  component: SecondaryLayout,
  meta: {
    requiresAuth: true,
    permissions: {
      allowedRoles: [Role.SUPERADMIN, Role.ADMIN],
      requiredPermissions: ["venues:create", "venues:edit"],
    },
  },
  children: [
    //{
    //  path: "venues/manage",
    //  name: "manage-venues",
    //  component: () => import("@/views/admin/venues/ManageVenuesView.vue"),
    //},
    //{
    //  path: "venues/create",
    //  name: "create-venue",
    //  component: () => import("@/views/admin/venues/CreateVenueView.vue"),
    //},
    //{
    //  path: "venues/edit/:id",
    //  name: "edit-venue",
    //  component: () => import("@/views/admin/venues/EditVenueView.vue"),
    //},
  ],
}

const notFoundRoute: RouteRecordRaw = {
  path: "/:pathMatch(.*)*",
  component: EmptyLayout,
  children: [
    {
      path: "",
      name: "not-found",
      component: () => import("@/views/NotFoundView.vue"),
    },
  ],
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [publicRoutes, authRoutes, protectedRoutes, adminRoutes, notFoundRoute],
})

router.beforeEach(authGuard)

export default router
