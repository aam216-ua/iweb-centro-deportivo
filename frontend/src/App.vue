<script setup lang="ts">
import { Toaster } from "@/components/ui/sonner"
import { RouterView } from "vue-router"
import { useAuthStore } from "@/stores/auth"
import { onMounted } from "vue"

const authStore = useAuthStore()

onMounted(async () => {
  await authStore.checkAuth()
})
</script>

<template>
  <RouterView />
  <Toaster theme="dark" richColors />
</template>
