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
import { useAuthStore } from "@/stores/auth"
import { CircleUser } from "lucide-vue-next"
import { computed } from "vue"
import { useRouter } from "vue-router"

const props = defineProps<{
  buttonClass?: string
}>()

const router = useRouter()
const authStore = useAuthStore()
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
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" size="icon" :class="buttonClass">
        <CircleUser class="h-6 w-6" />
        <span class="sr-only">Menú de usuario</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuLabel>
        <RouterLink class="hover:underline" to="/profile">
          {{ user?.name }}
        </RouterLink>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem @click="handleSettings">Ajustes</DropdownMenuItem>
      <DropdownMenuItem @click="handleLogout">Cerrar Sesión</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
