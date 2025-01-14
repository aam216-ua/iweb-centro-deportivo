<script setup lang="ts">
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { venuesService } from "@/services/venue"
import { useAuthStore } from "@/stores/auth"
import type { Venue } from "@/types/venue"
import Autoplay from "embla-carousel-autoplay"
import { Activity, Clock, MapPin, Users } from "lucide-vue-next"
import { computed, onMounted, ref } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()
const authStore = useAuthStore()

const isAuthenticated = computed(() => authStore.isAuthenticated)
const user = computed(() => authStore.user)

const venues = ref<Venue[]>([])
const api = { isLoading: ref(false), error: ref(null) }

const fetchVenues = async () => {
  api.isLoading.value = true
  try {
    const response = await venuesService.getAll({
      status: "available",
      size: 10,
    })
    venues.value = response.data
  } catch (error) {
    console.error("Error fetching venues:", error)
  } finally {
    api.isLoading.value = false
  }
}

const getImagePath = (activityName: string) => {
  switch (activityName) {
    case "Pádel":
      return "vpad.jpg"
      break
    case "Baloncesto":
      return "vten.jpg"
      break
    case "Fútbol":
      return "vfut.jpg"
      break
    case "Bádminton":
      return "vbad.jpg"
      break
    case "Voleyball":
      return "vvol.jpg"
      break
    case "Tenis":
      return "vbal.jpg"
      break
    default:
      return "/placeholder.svg"
      break
  }
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(price)
}

const autoplayPlugin = Autoplay({ delay: 3000 })

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

onMounted(() => {
  fetchVenues()
})
</script>

<template>
  <div class="container mx-auto py-8">
    <section v-if="isAuthenticated" class="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>¡Bienvenido, {{ user?.name }}!</CardTitle>
        </CardHeader>
        <CardContent>
          <Button @click="router.push({ name: 'book' })" size="lg"> Reservar Ahora </Button>
        </CardContent>
      </Card>

      <div class="space-y-4">
        <Carousel
          class="w-full"
          :opts="{
            align: 'start',
            loop: true,
          }"
          :plugins="[autoplayPlugin]"
        >
          <CarouselContent class="-ml-2 md:-ml-4">
            <CarouselItem
              v-for="venue in venues"
              :key="venue.id"
              class="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 select-none"
            >
              <div class="relative aspect-[16/9] group overflow-hidden rounded-2xl">
                <img
                  :src="getImagePath(venue.activity.name)"
                  :alt="venue.activity.name"
                  class="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div
                  class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/0"
                >
                  <div class="absolute inset-0 flex flex-col justify-end p-6">
                    <div class="space-y-4">
                      <div class="space-y-2">
                        <Badge variant="secondary" class="backdrop-blur-sm bg-black/70 text-white">
                          {{ venue.activity.name }}
                        </Badge>
                        <h3 class="text-2xl font-bold text-white">
                          {{ venue.name }}
                        </h3>
                        <p class="text-sm text-gray-200 line-clamp-2">
                          {{ venue.description || "Sin descripción disponible" }}
                        </p>
                      </div>
                      <div class="flex items-center justify-between">
                        <span class="text-lg font-semibold text-white">
                          {{ formatPrice(venue.fee) }}/hora
                        </span>
                        <div class="flex items-center gap-2 text-gray-200">
                          <Users class="h-4 w-4" />
                          <span class="text-sm">{{ venue.capacity }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious class="hidden md:flex -left-4 hover:bg-background/80 backdrop-blur" />
          <CarouselNext class="hidden md:flex -right-4 hover:bg-background/80 backdrop-blur" />
        </Carousel>
      </div>

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

    <section v-else class="space-y-8">
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

      <div class="space-y-4">
        <Carousel
          class="w-full"
          :opts="{
            align: 'start',
            loop: true,
          }"
          :plugins="[autoplayPlugin]"
        >
          <CarouselContent class="-ml-2 md:-ml-4">
            <CarouselItem
              v-for="venue in venues"
              :key="venue.id"
              class="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
            >
              <div class="relative aspect-[16/9] group overflow-hidden rounded-lg">
                <img
                  :src="getImagePath(venue.activity.name)"
                  :alt="venue.activity.name"
                  class="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div
                  class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/0"
                >
                  <div class="absolute inset-0 flex flex-col justify-end p-6">
                    <div class="space-y-4">
                      <div class="space-y-2">
                        <Badge variant="secondary" class="backdrop-blur-sm bg-black/70 text-white">
                          {{ venue.activity.name }}
                        </Badge>
                        <h3 class="text-2xl font-bold text-white">
                          {{ venue.name }}
                        </h3>
                        <p class="text-sm text-gray-200 line-clamp-2">
                          {{ venue.description || "Sin descripción disponible" }}
                        </p>
                      </div>
                      <div class="flex items-center justify-between">
                        <span class="text-lg font-semibold text-white">
                          {{ formatPrice(venue.fee) }}/hora
                        </span>
                        <div class="flex items-center gap-2 text-gray-200">
                          <Users class="h-4 w-4" />
                          <span class="text-sm">{{ venue.capacity }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious class="hidden md:flex -left-4 hover:bg-background/80 backdrop-blur" />
          <CarouselNext class="hidden md:flex -right-4 hover:bg-background/80 backdrop-blur" />
        </Carousel>
      </div>

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
