<script setup lang="ts">
const props = defineProps<{
  class?: string
  linkClass?: string
}>()
</script>

<template>
  <nav :class="props.class">
    <RouterLink to="/info" :class="[linkClass, 'transition-colors hover:text-foreground/80']">
      Información
    </RouterLink>
    <RouterLink to="/membership" :class="[linkClass, 'transition-colors hover:text-foreground/80']">
      Hazte socio
    </RouterLink>
  </nav>
</template>
