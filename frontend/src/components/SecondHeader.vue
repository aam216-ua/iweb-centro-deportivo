<script setup lang="ts">
import HeaderReserve from "@/components/HeaderReserve.vue"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuthStore } from "@/stores/auth"
import { CircleUser, Menu } from "lucide-vue-next"
import { computed } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()
const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)
const user = computed(() => authStore.user)

const handleLogout = () => {
  authStore.logout()
  router.push({ name: "home" })
}

const handleSettings = () => {
  router.push({ name: "settings" })
}
</script>

<template>
  <header class="sticky top-0 z-40 w-full border-b bg-background">
    <div class="container flex h-16 items-center">
      <div class="flex flex-1 items-center">
        <!-- Mobile Menu -->
        <Sheet>
          <SheetTrigger as-child class="md:hidden">
            <Button variant="ghost" size="icon" class="mr-2">
              <Menu class="h-6 w-6" />
              <span class="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav class="grid gap-6 py-6">
              <RouterLink to="/info" class="text-lg font-medium">Información</RouterLink>
              <RouterLink to="/membership" class="text-lg font-medium">Hazte socio</RouterLink>
              <template v-if="isAuthenticated">
                <RouterLink to="/reserve" class="text-lg font-medium">Mis Reservas</RouterLink>
                <RouterLink to="/settings" class="text-lg font-medium">Ajustes</RouterLink>
                <button class="text-lg font-medium text-left" @click="handleLogout">
                  Cerrar Sesión
                </button>
              </template>
            </nav>
          </SheetContent>
        </Sheet>

        <RouterLink to="/" class="mr-6 flex items-center">
          <img src="/placeholder.svg" alt="Logo" class="h-6 w-auto" />
        </RouterLink>

        <nav class="hidden md:flex items-center space-x-6 text-sm font-medium">
          <RouterLink to="/info" class="transition-colors hover:text-foreground/80"
            >Información</RouterLink
          >
          <RouterLink to="/membership" class="transition-colors hover:text-foreground/80"
            >Hazte socio</RouterLink
          >
        </nav>
      </div>

      <!-- Desktop Menu -->
      <div class="flex items-center gap-2">
        <HeaderReserve />
        <DropdownMenu v-if="isAuthenticated">
          <DropdownMenuTrigger as-child>
            <Button variant="ghost" size="icon">
              <CircleUser class="h-6 w-6" />
              <span class="sr-only">Menú de usuario</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel
              ><RouterLink class="hover:underline" to="/profile">{{
                user?.name
              }}</RouterLink></DropdownMenuLabel
            >
            <DropdownMenuSeparator />
            <DropdownMenuItem @click="handleSettings">Ajustes</DropdownMenuItem>
            <DropdownMenuItem @click="handleLogout">Cerrar Sesión</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  </header>
</template>
