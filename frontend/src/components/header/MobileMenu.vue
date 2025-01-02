<script setup lang="ts">
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuthStore } from "@/stores/auth"
import { Menu } from "lucide-vue-next"
import { computed } from "vue"
import { useRouter } from "vue-router"

const props = defineProps<{
  buttonClass?: string
}>()

const router = useRouter()
const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)

const handleLogout = () => {
  authStore.logout()
  router.push({ name: "home" })
}
</script>

<template>
  <Sheet>
    <SheetTrigger as-child>
      <Button variant="ghost" size="icon" :class="buttonClass">
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
          <button class="text-lg font-medium text-left" @click="handleLogout">Cerrar Sesión</button>
        </template>
      </nav>
    </SheetContent>
  </Sheet>
</template>
