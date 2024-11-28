<script lang="ts" setup>
import { computed, defineProps } from "vue"

const props = defineProps({
  country: {
    type: String,
    required: true,
  },
  countryName: {
    type: String,
    required: false,
  },
})
</script>

<template>
  <span class="bg-foreground/20 flex h-4 w-[1.5em] overflow-hidden rounded-sm">
    <div v-if="country" :class="`fi-${country.toLowerCase()}`" class="fib fi text-2xl"></div>
  </span>
</template>
