<script setup lang="ts">
import RechargeDialog from "@/components/RechargeDialog.vue"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { usePermissions } from "@/lib/permissions"
import { roleLabels } from "@/lib/role"
import { useAuthStore } from "@/stores/auth"
import { Shield } from "lucide-vue-next"
import { computed, ref } from "vue"
import { useRouter } from "vue-router"

const props = defineProps<{
  buttonClass?: string
}>()

const { isStaff } = usePermissions()
const router = useRouter()
const authStore = useAuthStore()
const user = computed(() => authStore.user)
const showRechargeDialog = ref(false)

const handleLogout = () => {
  authStore.logout()
  router.push({ name: "home" })
}

const handleSettings = () => {
  router.push({ name: "settings" })
}

const handleProfile = () => {
  router.push({ name: "profile", params: { id: user.value?.id } })
}

const handleDashboard = () => {
  router.push({ name: "dashboard" })
}

const userInitials = computed(() => {
  if (!user.value?.name) return "U"
  return user.value.name.split(" ").join("").toUpperCase().slice(0, 2)
})

defineOptions({
  name: "UserMenu",
})
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" :class="['relative h-8 w-8 rounded-full', buttonClass]">
        <Avatar class="h-8 w-8">
          <AvatarImage src="" :alt="user?.name || 'Usuario'" />
          <AvatarFallback>{{ userInitials }}</AvatarFallback>
        </Avatar>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-56" align="end">
      <DropdownMenuLabel class="font-normal">
        <div class="flex flex-col space-y-1">
          <p class="text-sm font-medium leading-none">
            {{ user?.name }}
          </p>
          <p class="text-xs leading-none text-muted-foreground">
            {{ user?.email }}
          </p>
        </div>
        <Badge v-show="isStaff" class="w-fit mt-2" variant="outline">
          {{ roleLabels[user?.role || "admin"] }}
        </Badge>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem v-show="isStaff" @click="handleDashboard">
          Panel de Administración <Shield class="ml-2 h-4 w-4" />
        </DropdownMenuItem>
        <DropdownMenuItem @click="handleProfile">Perfil</DropdownMenuItem>
        <DropdownMenuItem @click="handleSettings">Ajustes de Usuario</DropdownMenuItem>
        <DropdownMenuItem @click="showRechargeDialog = true">Recargar Saldo</DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem @click="handleLogout">Cerrar Sesión</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>

  <RechargeDialog v-model:open="showRechargeDialog" @recharge-complete="authStore.refreshUser()" />
</template>
