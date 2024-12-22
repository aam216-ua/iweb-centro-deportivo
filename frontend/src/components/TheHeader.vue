# TheHeader.vue
<script setup lang="ts">
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
import { randImage } from "@/lib/utils"
import { useAuthStore } from "@/stores/auth"
import { CircleUser, Menu } from "lucide-vue-next"
import { computed } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()
const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)

const handleReservasClick = () => {
  router.push({ name: "login" })
}

const handleLogout = () => {
  authStore.logout()
  router.push({ name: "home" })
}

const bgImg = randImage()
</script>

<template>
  <header class="relative h-80 bg-background">
    <div class="absolute inset-0 overflow-hidden">
      <img :src="bgImg" alt="" class="h-80 w-full object-cover" />
      <div
        class="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 via-30% to-transparent to-50%"
      ></div>
    </div>

    <div class="relative z-10 flex flex-col h-full">
      <div class="flex h-16 items-center justify-end px-6">
        <div class="flex items-center space-x-4">
          <Sheet>
            <SheetTrigger as-child class="md:hidden">
              <Button variant="ghost" size="icon" class="h-10 w-10">
                <Menu class="h-6 w-6 text-white" />
                <span class="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <nav class="grid gap-6 py-6 uppercase">
                <a href="#" class="text-lg font-medium">Información</a>
                <a href="#" class="text-lg font-medium">Hazte socio</a>
              </nav>
            </SheetContent>
          </Sheet>

          <DropdownMenu v-if="isAuthenticated">
            <DropdownMenuTrigger as-child>
              <Button variant="secondary" size="icon" class="h-10 w-10 rounded-full">
                <CircleUser class="h-6 w-6" />
                <span class="sr-only">Open user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" class="w-56">
              <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Perfil</DropdownMenuItem>
              <DropdownMenuItem>Mis Reservas</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem @click="handleLogout"> Cerrar Sesión </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <template v-else>
            <Button
              variant="secondary"
              @click="handleReservasClick"
              class="hidden md:flex rounded-full"
            >
              <CircleUser class="h-6 w-6" />
              Mis Reservas
            </Button>
            <Button
              variant="secondary"
              size="icon"
              @click="handleReservasClick"
              class="md:hidden h-10 w-10"
            >
              <CircleUser class="h-6 w-6" />
              <span class="sr-only">Mis Reservas</span>
            </Button>
          </template>
        </div>
      </div>

      <div class="px-6">
        <div class="mb-4">
          <img src="/placeholder.svg" alt="Logo" class="h-16 w-auto" />
        </div>

        <nav class="hidden md:flex md:space-x-4 uppercase">
          <a href="#" class="text-white hover:text-white/80">Información</a>
          <a href="#" class="text-white hover:text-white/80">Hazte socio</a>
        </nav>
      </div>
    </div>
  </header>
</template>
