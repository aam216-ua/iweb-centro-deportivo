import { useAuthStore } from "@/stores/auth.store"
import { createRouter, createWebHistory } from "vue-router"

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      children: [
        {
          path: "",
          name: "home",
          component: () => import("@/views/HomeView.vue"),
        },
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
        {
          path: "recover",
          name: "recover",
          component: () => import("@/views/auth/RecoverView.vue"),
          meta: { requiresGuest: true },
        },
      ],
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  if (!from.name) {
    await authStore.checkAuth()
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next("/login")
  } else {
    next()
  }
})

export default router
