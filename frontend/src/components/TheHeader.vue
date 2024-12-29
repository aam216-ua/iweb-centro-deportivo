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
import { randImage } from "@/lib/utils"
import { useAuthStore } from "@/stores/auth"
import { CircleUser, Menu } from "lucide-vue-next"
import { computed } from "vue"

const bgImg = randImage()
const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)
const user = computed(() => authStore.user)

const handleLogout = () => {
  authStore.logout()
}
</script>

<template>
  <header class="relative h-80 bg-background">
    <div class="absolute inset-0 overflow-hidden">
      <img :src="bgImg" alt="" class="h-80 w-full object-cover brightness-[0.6]" />
      <div
        class="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 via-30% to-transparent to-50%"
      ></div>
    </div>
    <div class="relative z-10 flex flex-col h-full">
      <div class="flex h-16 items-center justify-end px-6">
        <div class="flex items-center space-x-4">
          <!-- Mobile Menu -->
          <Sheet>
            <SheetTrigger as-child class="md:hidden">
              <Button variant="ghost" size="icon" class="h-10 w-10">
                <Menu class="h-6 w-6 text-white" />
                <span class="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <nav class="grid gap-6 py-6">
                <a href="#" class="text-lg font-medium uppercase">Información</a>
                <a href="#" class="text-lg font-medium uppercase">Hazte socio</a>
                <template v-if="isAuthenticated">
                  <a href="#" class="text-lg font-medium">Mis Reservas</a>
                  <a href="#" class="text-lg font-medium">Ajustes</a>
                  <a href="#" class="text-lg font-medium" @click.prevent="handleLogout"
                    >Cerrar Sesión</a
                  >
                </template>
              </nav>
            </SheetContent>
          </Sheet>

          <!-- Desktop Menu -->
          <div class="hidden md:flex items-center space-x-4">
            <HeaderReserve class="text-white" />
            <DropdownMenu v-if="isAuthenticated">
              <DropdownMenuTrigger as-child>
                <Button
                  variant="ghost"
                  size="icon"
                  class="h-10 w-10 text-white hover:text-white/90"
                >
                  <CircleUser class="h-6 w-6" />
                  <span class="sr-only">Menú de usuario</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{{ user?.name }}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Ajustes</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem @click="handleLogout"> Cerrar Sesión </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
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
