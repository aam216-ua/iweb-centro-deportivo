import EmptyLayout from "@/layouts/EmptyLayout.vue"
import MainLayout from "@/layouts/MainLayout.vue"
import SecondaryLayout from "@/layouts/SecondaryLayout.vue"
import { useAuthStore } from "@/stores/auth"
import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router"

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
      meta: { requiresGuest: true },
    },
    {
      path: "register",
      name: "register",
      component: () => import("@/views/auth/RegisterView.vue"),
      meta: { requiresGuest: true },
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

router.beforeEach((to) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated

  if (to.meta.requiresAuth && !isAuthenticated) {
    return {
      name: "login",
      query: { redirect: to.fullPath },
    }
  }

  if (to.meta.requiresGuest && isAuthenticated) {
    return { name: "home" }
  }
})

export default router
