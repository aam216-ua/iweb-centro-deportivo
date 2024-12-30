import EmptyLayout from "@/layouts/EmptyLayout.vue"
import MainLayout from "@/layouts/MainLayout.vue"
import SecondaryLayout from "@/layouts/SecondaryLayout.vue"
import { authGuard } from "@/router/guard"
import type { RouteRecordRaw } from "vue-router"
import { createRouter, createWebHistory } from "vue-router"

const publicRoutes: RouteRecordRaw = {
  path: "/",
  component: MainLayout,
  children: [
    {
      path: "",
      name: "home",
      component: () => import("@/views/HomeView.vue"),
    },
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
      path: "settings",
      name: "settings",
      component: () => import("@/views/SettingsView.vue"),
    },
    {
      path: "reserve",
      name: "reserve",
      component: () => import("@/views/ReserveView.vue"),
    },
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
  routes: [publicRoutes, authRoutes, protectedRoutes, notFoundRoute],
})

router.beforeEach(authGuard)

export default router
