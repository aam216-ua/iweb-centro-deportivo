import EmptyLayout from "@/layouts/EmptyLayout.vue"
import MainLayout from "@/layouts/MainLayout.vue"
import SecondaryLayout from "@/layouts/SecondaryLayout.vue"
import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router"

const userUtilRoutes: RouteRecordRaw = {
  path: "/",
  component: SecondaryLayout,
  children: [
    {
      path: "reserve",
      name: "reserve",
      component: () => import("@/views/ReserveView.vue"),
    },
    {
      path: "settings",
      name: "settings",
      component: () => import("@/views/SettingsView.vue"),
      meta: { publicWithAuth: false },
    },
  ],
}

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
    userUtilRoutes,
    {
      path: "/:pathMatch(.*)*",
      component: EmptyLayout,
      children: [
        {
          path: "",
          name: "not-found",
          component: () => import("@/views/NotFoundView.vue"),
        },
      ],
    },
  ],
})

export default router
