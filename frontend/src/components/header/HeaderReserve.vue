<script setup lang="ts">
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/stores/auth"
import { Pen } from "lucide-vue-next"
import { computed } from "vue"
import { useRouter } from "vue-router"

const props = defineProps<{
  class?: string
}>()

const router = useRouter()
const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)
const buttonText = computed(() => (isAuthenticated.value ? "Mis Reservas" : "Reserva ahora"))

const handleReservasClick = () => {
  const route = isAuthenticated.value ? { name: "book" } : { name: "login" }
  router.push(route)
}
</script>

<template>
  <div :class="props.class">
    <Button @click="handleReservasClick" class="hidden flex rounded-full">
      <Pen class="mr-2 h-5 w-5" />
      {{ buttonText }}
    </Button>
  </div>
</template>
