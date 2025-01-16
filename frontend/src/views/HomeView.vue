<script setup lang="ts">
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
import { Activity, ChevronRight, Clock, MapPin, Users } from "lucide-vue-next"
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
    case "Baloncesto":
      return "vten.jpg"
    case "Fútbol":
      return "vfut.jpg"
    case "Bádminton":
      return "vbad.jpg"
    case "Voleyball":
      return "vvol.jpg"
    case "Tenis":
      return "vbal.jpg"
    default:
      return "/placeholder.svg"
  }
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(price)
}

const autoplayPlugin = Autoplay({ delay: 4000 })

const caracteristicas = [
  {
    icon: MapPin,
    title: "Instalaciones Premium",
    description: "Acceso a instalaciones deportivas de primera calidad",
  },
  {
    icon: Clock,
    title: "Horarios Flexibles",
    description: "Disponibilidad de 8:00 a 21:30",
  },
  {
    icon: Users,
    title: "Eventos Grupales",
    description: "Espacios para hasta 200 participantes",
  },
  {
    icon: Activity,
    title: "Diversos Deportes",
    description: "Variedad de actividades deportivas",
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
  <div class="bg-background">
    <div class="container mx-auto px-4">
      <section v-if="isAuthenticated" class="space-y-8 py-6">
        <Card class="bg-gradient-to-bl from-primary/50 to-transparent border-0">
          <CardContent class="pt-6">
            <div class="flex items-center justify-between">
              <div>
                <h1 class="text-2xl font-semibold mb-2">
                  ¡Bienvenido! <span class="animate-wave inline-block">👋</span>
                </h1>
                <p class="text-muted-foreground">¿Listo para tu próxima actividad?</p>
              </div>
              <Button @click="router.push({ name: 'book' })" class="group">
                Reservar
                <ChevronRight
                  class="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform"
                />
              </Button>
            </div>
          </CardContent>
        </Card>

      </section>

      <section v-else class="space-y-8 py-6">
        <Card class="bg-gradient-to-r from-primary/5 to-transparent border-0">
          <CardContent class="py-8">
            <div class="max-w-2xl mx-auto text-center">
              <h1 class="text-2xl font-semibold mb-4">Tu Espacio Deportivo Ideal</h1>
              <p class="text-muted-foreground mb-6">
                Encuentra y reserva las mejores instalaciones deportivas en tu zona. Simple, rápido
                y sin complicaciones.
              </p>
              <Button @click="handleLoginClick" class="group">
                Comenzar
                <ChevronRight
                  class="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform"
                />
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold">Instalaciones Destacadas</h2>
          </div>

          <Carousel
            class="w-full"
            :opts="{
              align: 'start',
              loop: true,
            }"
            :plugins="[autoplayPlugin]"
          >
            <CarouselContent class="-ml-3">
              <CarouselItem
                v-for="venue in venues"
                :key="venue.id"
                class="pl-3 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 select-none"
              >
                <div class="group relative aspect-[16/9] overflow-hidden rounded-lg bg-muted">
                  <img
                    :src="getImagePath(venue.activity.name)"
                    :alt="venue.activity.name"
                    class="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div
                    class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"
                  >
                    <div class="absolute inset-x-0 bottom-0 p-4">
                      <div class="space-y-2">
                        <div class="flex items-center gap-1.5">
                          <Badge class="bg-primary/90 text-xs">
                            {{ venue.activity.name }}
                          </Badge>
                        </div>
                        <h3 class="text-base font-semibold text-white">{{ venue.name }}</h3>
                        <p class="text-xs text-gray-300 line-clamp-2">
                          {{ venue.description || "Sin descripción disponible" }}
                        </p>
                        <div class="flex items-center justify-between pt-1">
                          <span class="text-sm font-medium text-white">
                            {{ formatPrice(venue.fee) }}/h
                          </span>
                          <div class="flex items-center gap-1 text-gray-300">
                            <Users class="h-3 w-3" />
                            <span class="text-xs">{{ venue.capacity }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious class="hidden md:flex -left-3 h-8 w-8" />
            <CarouselNext class="hidden md:flex -right-3 h-8 w-8" />
          </Carousel>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <Card
            v-for="(feature, index) in caracteristicas"
            :key="index"
            class="group border-0 bg-secondary/5 hover:bg-secondary/10 transition-colors"
          >
            <CardContent class="p-4">
              <div class="flex gap-3 items-start">
                <div
                  class="rounded-full bg-secondary/10 p-2 group-hover:bg-secondary/20 transition-colors"
                >
                  <component :is="feature.icon" class="h-4 w-4" />
                </div>
                <div>
                  <h3 class="font-medium text-sm mb-1">{{ feature.title }}</h3>
                  <p class="text-xs text-muted-foreground">{{ feature.description }}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes wave {
  0%,
  100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(-10deg);
  }
  75% {
    transform: rotate(10deg);
  }
}

.animate-wave {
  animation: wave 1.5s ease-in-out infinite;
}
</style>
