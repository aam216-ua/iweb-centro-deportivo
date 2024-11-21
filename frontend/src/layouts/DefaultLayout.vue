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
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuthStore } from "@/stores/auth.store"
import {
  CircleUser,
  HelpCircle,
  House,
  LogIn,
  LogOut,
  Menu,
  Search,
  Settings,
  UserPlus,
} from "lucide-vue-next"
import { RouterLink, RouterView } from "vue-router"

const authStore = useAuthStore()
</script>

<template>
  <div class="flex min-h-svh w-full flex-col">
    <header class="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <nav
        class="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6"
      >
        <RouterLink to="/" class="flex items-center gap-2 text-lg font-semibold md:text-base">
          <House class="h-6 w-6" />
        </RouterLink>
        <RouterLink
          to="/"
          class="text-foreground transition-colors hover:text-foreground"
          active-class="text-foreground"
          inactive-class="text-muted-foreground"
        >
          Dashboard
        </RouterLink>
        <RouterLink
          to="/"
          class="transition-colors hover:text-foreground"
          active-class="text-foreground"
          inactive-class="text-muted-foreground"
        >
          Productos
        </RouterLink>
        <RouterLink
          to="/"
          class="transition-colors hover:text-foreground"
          active-class="text-foreground"
          inactive-class="text-muted-foreground"
        >
          Clientes
        </RouterLink>
      </nav>

      <!-- Mobile Navigation -->
      <Sheet>
        <SheetTrigger as-child>
          <Button variant="outline" size="icon" class="shrink-0 md:hidden">
            <Menu class="h-5 w-5" />
            <span class="sr-only">Menu de navegación</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav class="grid gap-6 text-lg font-medium">
            <RouterLink to="/" class="flex items-center gap-2 text-lg font-semibold">
              <House class="h-6 w-6" />
            </RouterLink>
            <RouterLink to="/" class="hover:text-foreground"> Dashboard </RouterLink>
            <RouterLink to="/" class="text-muted-foreground hover:text-foreground">
              Productos
            </RouterLink>
            <RouterLink to="/" class="text-muted-foreground hover:text-foreground">
              Clientes
            </RouterLink>
          </nav>
        </SheetContent>
      </Sheet>

      <!-- Right Side -->
      <div class="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <!-- Search -->
        <form class="ml-auto flex-1 sm:flex-initial">
          <div class="relative">
            <Search class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar..."
              class="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
            />
          </div>
        </form>

        <!-- User Menu -->
        <DropdownMenu v-if="authStore.isAuthenticated">
          <DropdownMenuTrigger as-child>
            <Button variant="secondary" size="icon" class="rounded-full">
              <CircleUser class="h-5 w-5" />
              <span class="sr-only">Menu de usuario</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Settings class="mr-2 h-4 w-4" />
              Configuración
            </DropdownMenuItem>
            <DropdownMenuItem>
              <HelpCircle class="mr-2 h-4 w-4" />
              Soporte
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem @click="authStore.logout">
              <LogOut class="mr-2 h-4 w-4" />
              Cerrar Sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <!-- Auth Buttons -->
        <div v-else class="flex items-center gap-2">
          <RouterLink to="/login">
            <Button variant="ghost">
              <LogIn class="h-4 w-4" />
              <span class="hidden lg:inline">Iniciar Sesión</span>
            </Button>
          </RouterLink>
          <RouterLink to="/register">
            <Button>
              <UserPlus class="h-4 w-4" />
              <span class="hidden md:inline">Registrarse</span>
            </Button>
          </RouterLink>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container flex-1 py-6">
      <RouterView />
    </main>

    <!-- Footer -->
    <footer class="border-t mt-auto">
      <div class="container flex h-16 items-center justify-between text-sm text-muted-foreground">
        <p>&copy; {{ new Date().getFullYear() }} Todos los derechos reservados.</p>
        <nav class="flex gap-4">
          <RouterLink to="/privacy" class="hover:text-primary"> Privacidad </RouterLink>
          <RouterLink to="/terms" class="hover:text-primary"> Términos </RouterLink>
        </nav>
      </div>
    </footer>
  </div>
</template>
