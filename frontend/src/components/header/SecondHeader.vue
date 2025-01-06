<script setup lang="ts">
import HeaderReserve from "@/components/header/HeaderReserve.vue"
import MobileMenu from "@/components/header/MobileMenu.vue"
import NavigationLinks from "@/components/header/NavigationLinks.vue"
import UserMenu from "@/components/header/UserMenu.vue"
import { useAuthStore } from "@/stores/auth"
import { computed } from "vue"

const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)
</script>

<template>
  <header class="sticky top-0 z-40 w-full border-b bg-background">
    <div class="container flex h-16 items-center">
      <div class="flex flex-1 items-center">
        <MobileMenu buttonClass="md:hidden mr-2" />
        <RouterLink to="/" class="mr-6 flex items-center">
          <img src="/birdt.png" alt="Logo" class="h-8 w-auto" />
        </RouterLink>
        <NavigationLinks class="hidden md:flex items-center space-x-6 text-sm font-medium" />
      </div>

      <div class="flex items-center gap-2">
        <HeaderReserve />
        <UserMenu v-if="isAuthenticated" />
      </div>
    </div>
  </header>
</template>
