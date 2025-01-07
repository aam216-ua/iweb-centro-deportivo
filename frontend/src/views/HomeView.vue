<script setup lang="ts">
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuthStore } from "@/stores/auth"
import { Activity, Clock, MapPin, Users } from "lucide-vue-next"
import { computed } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()
const authStore = useAuthStore()

const isAuthenticated = computed(() => authStore.isAuthenticated)
const user = computed(() => authStore.user)

const caracteristicas = [
  {
    icon: MapPin,
    title: "Múltiples Instalaciones",
    description: "Acceso a instalaciones deportivas premium en toda la ciudad",
  },
  {
    icon: Clock,
    title: "Horario Flexible",
    description: "Reserva turnos desde las 8:00 hasta las 21:30",
  },
  {
    icon: Users,
    title: "Actividades Grupales",
    description: "Instalaciones con capacidad de hasta 200 personas",
  },
  {
    icon: Activity,
    title: "Diversos Deportes",
    description: "Fútbol, tenis, baloncesto y más",
  },
]

const handleLoginClick = () => {
  router.push({ name: "login", query: { redirect: "/" } })
}
</script>

<template>
  <div class="container mx-auto py-8">
    <section v-if="isAuthenticated" class="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>¡Bienvenido, {{ user?.name }}!</CardTitle>
        </CardHeader>
        <CardContent>
          <Button @click="router.push({ name: 'book' })" size="lg"> Reservar Ahora </Button>
        </CardContent>
      </Card>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card v-for="(feature, index) in caracteristicas" :key="index">
          <CardContent class="pt-6">
            <div
              class="rounded-full bg-secondary p-3 w-12 h-12 flex items-center justify-center mb-4"
            >
              <component :is="feature.icon" class="h-6 w-6" />
            </div>
            <h3 class="font-semibold text-xl mb-2">{{ feature.title }}</h3>
            <p class="text-muted-foreground">{{ feature.description }}</p>
          </CardContent>
        </Card>
      </div>
    </section>

    <section v-else class="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle class="text-2xl sm:text-3xl font-bold tracking-tight text-center">
            Reserva tu Pista Deportiva Ideal
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-6">
          <p class="text-muted-foreground text-center">
            Encuentra y reserva las mejores instalaciones deportivas en tu zona. Simple, rápido y
            fiable.
          </p>
          <div class="flex justify-center">
            <Button @click="handleLoginClick" size="lg"> Iniciar Sesión </Button>
          </div>
        </CardContent>
      </Card>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card v-for="(feature, index) in caracteristicas" :key="index">
          <CardContent class="pt-6">
            <div
              class="rounded-full bg-secondary p-3 w-12 h-12 flex items-center justify-center mb-4"
            >
              <component :is="feature.icon" class="h-6 w-6" />
            </div>
            <h3 class="font-semibold text-xl mb-2">{{ feature.title }}</h3>
            <p class="text-muted-foreground">{{ feature.description }}</p>
          </CardContent>
        </Card>
      </div>
    </section>
  </div>
</template>
