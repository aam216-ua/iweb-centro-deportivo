<script setup lang="ts">
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import { onMounted, ref } from "vue"
import type { Venue } from "@/types/venue"
import { venuesService } from "@/services/venue"

const venues = ref<Venue[]>([])
const isLoading = ref(true)

const getVenueImage = (activityId: string) => {
  // This will be replaced with proper image paths later
  return "/placeholder.svg"
}

onMounted(async () => {
  try {
    const response = await venuesService.getAll({
      status: "available",
      size: 10
    })
    venues.value = response.data
  } catch (error) {
    console.error('Error fetching venues:', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="w-full py-6">
    <Carousel class="w-full max-w-5xl mx-auto">
      <CarouselContent>
        <CarouselItem v-for="venue in venues" :key="venue.id" class="md:basis-1/2 lg:basis-1/3">
          <div class="p-1">
            <Card class="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent class="flex aspect-square items-center justify-center p-6">
                <div class="space-y-4 text-center">
                  <img
                    :src="getVenueImage(venue.activity.id)"
                    :alt="venue.activity.name"
                    class="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h3 class="font-semibold text-lg">{{ venue.name }}</h3>
                  <div class="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
                    <span>{{ venue.activity.name }}</span>
                    <span>•</span>
                    <span>{{ venue.capacity }} personas</span>
                  </div>
                  <p class="font-semibold text-lg">€{{ venue.fee }}/hora</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  </div>
</template>
