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

const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)
const user = computed(() => authStore.user)

const handleLogout = () => {
  authStore.logout()
}
</script>

<template>
  <header class="sticky top-0 z-40 w-full border-b bg-background">
    <div class="container flex h-16 items-center px-4">
      <div class="flex flex-1">
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

        <a href="/" class="mr-6 flex items-center space-x-2">
          <img src="/placeholder.svg" alt="Logo" class="h-6 w-auto" />
        </a>
        <nav class="hidden md:flex items-center space-x-6 text-sm font-medium">
          <a href="#" class="transition-colors hover:text-foreground/80">Información</a>
          <a href="#" class="transition-colors hover:text-foreground/80">Hazte socio</a>
        </nav>
      </div>

      <!-- Desktop Menu -->
      <div class="hidden md:flex items-center space-x-4">
        <HeaderReserve />
        <DropdownMenu v-if="isAuthenticated">
          <DropdownMenuTrigger as-child>
            <Button variant="ghost" size="icon" class="h-10 w-10">
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
  </header>
</template>
