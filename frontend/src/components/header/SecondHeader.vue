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

<style scoped>
.shimmer-wrapper {
  position: relative;
  display: inline-block;
}

.shimmer-wrapper img {
  display: block;
  -webkit-mask-image: url("/birdt.png");
  mask-image: url("/birdt.png");
  -webkit-mask-size: contain;
  mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
}

.shimmer {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    45deg,
    transparent 25%,
    rgba(255, 255, 255, 0.2) 50%,
    transparent 75%,
    transparent 100%
  );
  background-size: 250% 250%;
  background-position: 200% 0;
  opacity: 0;
  transition: opacity 0.1s ease;
  mix-blend-mode: overlay;
}

.shimmer-wrapper:hover .shimmer {
  opacity: 1;
  animation: shimmer 1.5s linear forwards;
}

@keyframes shimmer {
  to {
    background-position: -100% 0;
  }
}
</style>

<template>
  <header class="sticky top-0 z-40 w-full border-b bg-background">
    <div class="container flex h-16 items-center">
      <div class="flex flex-1 items-center">
        <MobileMenu buttonClass="md:hidden mr-2" />
        <RouterLink to="/" class="mr-6 flex items-center">
          <div class="shimmer-wrapper">
            <img src="/birdt.png" alt="Logo" class="h-8 w-auto" />
            <div class="shimmer"></div>
          </div>
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
