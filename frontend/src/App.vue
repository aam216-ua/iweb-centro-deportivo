<script setup lang="ts">
import { Toaster } from "@/components/ui/toast"
import DefaultLayout from "@/layouts/DefaultLayout.vue"
import type { LayoutNames } from "@/layouts/types"
import { computed } from "vue"
import { useRoute } from "vue-router"

const route = useRoute()
const layout = computed(() => {
  return (route.meta.layout as LayoutNames) || "default"
})

const layouts = {
  default: DefaultLayout,
}
</script>

<template>
  <Toaster />
  <component :is="layouts[layout]">
    <RouterView />
  </component>
</template>
