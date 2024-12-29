<script setup lang="ts">
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/stores/auth"
import { CircleUser, Pen } from "lucide-vue-next"
import { computed } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()
const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)

const buttonText = computed(() => (isAuthenticated.value ? "Mis Reservas" : "Reserva ahora"))

const handleReservasClick = () => {
  const route = isAuthenticated.value ? { name: "reserves" } : { name: "login" }
  router.push(route)
}
</script>

<template>
  <Button variant="outline" @click="handleReservasClick" class="hidden md:flex rounded-full">
    <Pen class="mr-2 h-5 w-5" />
    {{ buttonText }}
  </Button>
  <Button variant="outline" size="icon" @click="handleReservasClick" class="md:hidden rounded-full">
    <CircleUser class="h-6 w-6" />
    <span class="sr-only">{{ buttonText }}</span>
  </Button>
</template>
