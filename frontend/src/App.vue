<script setup lang="ts">
import { Toaster } from "@/components/ui/sonner"
import { RouterView } from "vue-router"
</script>

<template>
  <RouterView />
  <Toaster theme="dark" richColors />
</template>
