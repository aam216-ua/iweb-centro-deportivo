<script setup lang="ts">
import TheFooter from "@/components/TheFooter.vue"
import TheHeader from "@/components/header/TheHeader.vue"
</script>

<template>
  <div class="flex flex-col min-h-svh">
    <TheHeader />
    <main class="flex-1 bg-muted/10">
      <RouterView />
    </main>
    <TheFooter />
  </div>
</template>
