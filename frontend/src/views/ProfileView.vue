<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { roleLabels } from "@/lib/role"
import { usersService } from "@/services/user"
import { useAuthStore } from "@/stores/auth"
import type { User } from "@/types/user"
import { computed, onMounted, ref } from "vue"
import { useRoute } from "vue-router"

const route = useRoute()
const authStore = useAuthStore()
const loadedUser = ref<User | null>(null)

const user = computed<User | null>(() => {
  const id = route.params.id as string
  if (!id || id === authStore.user?.id) {
    return authStore.user
  }
  return loadedUser.value
})

const title = computed(() => {
  const id = route.params.id as string
  if (!id || id === authStore.user?.id) {
    return "Mi Perfil"
  }
  return "Perfil de Usuario"
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
          <h1 class="text-2xl sm:text-3xl font-bold">{{ title }}</h1>
          <p class="text-balance text-muted-foreground">Información detallada de la cuenta</p>
        </div>

        <div class="mt-6 grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Información Personal</CardTitle>
            </CardHeader>
            <CardContent class="grid gap-4">
              <div class="grid grid-cols-2 gap-2">
                <div>
                  <p class="text-sm text-muted-foreground">Nombre</p>
                  <p class="font-medium">{{ user?.name || "-" }}</p>
                </div>
                <div>
                  <p class="text-sm text-muted-foreground">Apellidos</p>
                  <p class="font-medium">{{ user?.surname || "-" }}</p>
                </div>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Correo Electrónico</p>
                <p class="font-medium">{{ user?.email || "-" }}</p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Teléfono</p>
                <p class="font-medium">{{ user?.phone || "-" }}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Detalles de la Cuenta</CardTitle>
            </CardHeader>
            <CardContent class="grid gap-4">
              <div>
                <p class="text-sm text-muted-foreground">Rol</p>
                <p class="font-medium">{{ roleLabels[user?.role || "customer"] }}</p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Saldo</p>
                <p class="font-medium">{{ user?.balance ? user.balance : "-" }}</p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Fecha de Registro</p>
                <p class="font-medium">{{ user?.createdAt ? formatDate(user.createdAt) : "-" }}</p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Última Actualización</p>
                <p class="font-medium">{{ user?.updatedAt ? formatDate(user.updatedAt) : "-" }}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  </div>
</template>
