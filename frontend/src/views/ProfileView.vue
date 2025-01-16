<script setup lang="ts">
import RechargeDialog from "@/components/RechargeDialog.vue"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { usePermissions } from "@/lib/permissions"
import { getStatusConfig } from "@/lib/utils"
import { usersService } from "@/services/user"
import { useAuthStore } from "@/stores/auth"
import type { User } from "@/types/user"
import { Calendar, Mail, Phone, PlusCircle, RefreshCcw, Wallet } from "lucide-vue-next"
import { computed, onMounted, ref } from "vue"
import { useRoute } from "vue-router"

defineOptions({
  name: "ProfileView",
})

const route = useRoute()
const authStore = useAuthStore()
const { isStaff } = usePermissions()
const loadedUser = ref<User | null>(null)
const showRechargeDialog = ref(false)

const user = computed<User | null>(() => {
  const id = route.params.id as string
  if (!id || id === authStore.user?.id) return authStore.user
  return loadedUser.value
})

const userInitials = computed(() => {
  if (!user.value?.name) return "U"
  const [firstName, lastName] = [user.value.name, user.value.surname]
  if (!lastName) return firstName.charAt(0).toUpperCase()
  return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase()
})

const statusConfig = computed(() => {
  if (!user.value?.status) return null
  return getStatusConfig(user.value.status)
})

onMounted(async () => {
  const id = route.params.id as string
  if (id && id !== authStore.user?.id) {
    try {
      loadedUser.value = await usersService.get(id)
    } catch (error) {
      console.error("Error fetching user data:", error)
    }
  }
})

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(date))
}
</script>

<template>
  <div class="container mx-auto py-8">
    <div class="grid gap-8">
      <section>
        <div class="grid gap-2">
          <div class="flex items-center gap-4">
            <Avatar class="h-16 w-16">
              <AvatarImage src="" :alt="user?.name" />
              <AvatarFallback class="text-lg">{{ userInitials }}</AvatarFallback>
            </Avatar>
            <div>
              <div class="flex flex-row items-start gap-2">
                <Badge variant="secondary" class="mb-2">
                  {{ user?.role }}
                </Badge>
                <div v-if="statusConfig" class="flex items-center gap-2">
                  <component :is="statusConfig.icon" :class="`h-4 w-4 ${statusConfig.color}`" />
                  <span
                    :class="`inline-flex rounded-md px-2 py-1 text-xs font-medium ${statusConfig.bg} ${statusConfig.color}`"
                  >
                    {{ statusConfig.label }}
                  </span>
                </div>
              </div>
              <h1 class="text-2xl sm:text-3xl font-bold">{{ user?.name }} {{ user?.surname }}</h1>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div class="grid gap-2">
          <h2 class="text-lg font-semibold">Información Personal</h2>
        </div>
        <div class="mt-4 space-y-4">
          <div class="flex items-center gap-3">
            <Mail class="w-5 h-5 text-muted-foreground" />
            <div>
              <p class="text-sm text-muted-foreground">Correo Electrónico</p>
              <p class="font-medium">{{ user?.email || "-" }}</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <Phone class="w-5 h-5 text-muted-foreground" />
            <div>
              <p class="text-sm text-muted-foreground">Teléfono</p>
              <p class="font-medium">{{ user?.phone || "-" }}</p>
            </div>
          </div>
          <div class="flex items-center gap-3" v-if="isStaff || user?.id === authStore.user?.id">
            <Wallet class="w-5 h-5 text-muted-foreground" />
            <div>
              <p class="text-sm text-muted-foreground">Saldo Actual</p>
              <div class="flex items-center gap-2">
                <p class="font-medium">
                  {{ user?.balance !== undefined ? `€${user.balance.toFixed(2)}` : "-" }}
                </p>
                <Button
                  v-if="user?.id === authStore.user?.id"
                  variant="ghost"
                  size="icon"
                  class="h-8 w-8"
                  @click="showRechargeDialog = true"
                >
                  <PlusCircle class="h-4 w-4" />
                  <span class="sr-only">Recargar saldo</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="border-t pt-8">
        <div class="grid gap-2">
          <h2 class="text-lg font-semibold">Detalles de la Cuenta</h2>
        </div>
        <div class="mt-4 space-y-4">
          <div class="flex items-center gap-3">
            <Calendar class="w-5 h-5 text-muted-foreground" />
            <div>
              <p class="text-sm text-muted-foreground">Fecha de Registro</p>
              <p class="font-medium">{{ user?.createdAt ? formatDate(user.createdAt) : "-" }}</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <RefreshCcw class="w-5 h-5 text-muted-foreground" />
            <div>
              <p class="text-sm text-muted-foreground">Última Actualización</p>
              <p class="font-medium">{{ user?.updatedAt ? formatDate(user.updatedAt) : "-" }}</p>
            </div>
          </div>
        </div>
      </section>
    </div>

    <RechargeDialog v-model:open="showRechargeDialog" />
  </div>
</template>
