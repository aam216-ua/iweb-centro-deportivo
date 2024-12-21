// router/index.ts
import EmptyLayout from "@/layouts/EmptyLayout.vue"
import MainLayout from "@/layouts/MainLayout.vue"
import { useAuthStore } from "@/stores/auth"
import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router"

// Auth routes
const authRoutes: RouteRecordRaw = {
  path: "/",
  component: EmptyLayout,
  children: [
    {
      path: "login",
      name: "login",
      component: () => import("@/views/auth/LoginView.vue"),
    },
    {
      path: "register",
      name: "register",
      component: () => import("@/views/auth/RegisterView.vue"),
    },
  ],
}

// App routes
const appRoutes: RouteRecordRaw = {
  path: "/",
  component: MainLayout,
  children: [
    {
      path: "",
      name: "home",
      component: () => import("@/views/HomeView.vue"),
      meta: { publicWithAuth: true },
    },
  ],
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    appRoutes,
    authRoutes,
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: () => import("@/views/NotFoundView.vue"),
    },
  ],
})

// Navigation guard
router.beforeEach(async (to) => {
  const authStore = useAuthStore()

  // Prevent authenticated users from accessing auth pages
  if (authStore.isAuthenticated && to.path.startsWith("/auth/")) {
    return { name: "home" }
  }
})

export default router
