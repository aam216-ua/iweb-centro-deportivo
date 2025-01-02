<script setup lang="ts">
import SecondHeader from "@/components/header/SecondHeader.vue"
import TheFooter from "@/components/TheFooter.vue"
</script>

<template>
  <div class="flex flex-col min-h-svh">
    <SecondHeader />
    <main class="flex-1 bg-muted/40">
      <RouterView />
    </main>
    <TheFooter />
  </div>
</template>
