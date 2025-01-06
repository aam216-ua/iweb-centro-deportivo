<script setup lang="ts">
import HeaderReserve from "@/components/header/HeaderReserve.vue"
import MobileMenu from "@/components/header/MobileMenu.vue"
import NavigationLinks from "@/components/header/NavigationLinks.vue"
import UserMenu from "@/components/header/UserMenu.vue"
import { randImage } from "@/lib/utils"
import { useAuthStore } from "@/stores/auth"
import { computed } from "vue"

const bgImg = randImage()
const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)
</script>

<template>
  <header class="relative h-80 bg-background">
    <div class="absolute inset-0 overflow-hidden">
      <img :src="bgImg" alt="" class="h-80 w-full object-cover brightness-[0.6]" />
      <div
        class="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 via-30% to-transparent to-60%"
      ></div>
    </div>
    <div class="relative z-10 flex flex-col h-full">
      <div class="container flex h-16 items-center justify-end">
        <div class="flex items-center gap-2">
          <MobileMenu buttonClass="md:hidden text-white" />
          <div class="hidden md:flex items-center gap-2">
            <HeaderReserve class="text-white" />
            <UserMenu v-if="isAuthenticated" buttonClass="text-white hover:text-white/90" />
          </div>
        </div>
      </div>

      <div class="container">
        <div class="mb-4">
          <RouterLink to="/">
            <img src="/logoc.png" alt="Logo" class="h-36 w-auto" />
          </RouterLink>
        </div>
        <NavigationLinks class="hidden md:flex gap-4" linkClass="text-white hover:text-white/80" />
      </div>
    </div>
  </header>
</template>
