<script lang="ts" setup>
import { cn } from "@/lib/utils"
import type { StepperItemProps } from "radix-vue"
import { StepperItem, useForwardProps } from "radix-vue"
import { computed, type HTMLAttributes } from "vue"

const props = defineProps<StepperItemProps & { class?: HTMLAttributes["class"] }>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props
  return delegated
})

const forwarded = useForwardProps(delegatedProps)

// Update the state type to include 'inactive'
interface StepperSlotProps {
  state: "active" | "completed" | "pending" | "inactive"
}
</script>

<template>
  <StepperItem
    v-slot="slotProps: StepperSlotProps"
    v-bind="forwarded"
    :class="cn('flex items-center gap-2 group data-[disabled]:pointer-events-none', props.class)"
  >
    <slot v-bind="slotProps" />
  </StepperItem>
</template>
