<script setup lang="ts">
import { Toaster } from "@/components/ui/sonner"
import { useAuthStore } from "@/stores/auth"
import { onMounted } from "vue"
import { RouterView } from "vue-router"

const authStore = useAuthStore()

onMounted(async () => {
  await authStore.checkAuth()
})
</script>

<template>
  <RouterView />
  <Toaster theme="dark" richColors />
</template>
