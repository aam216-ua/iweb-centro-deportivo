<script lang="ts" setup>
import { cn } from "@/lib/utils"
import { CalendarHeading, type CalendarHeadingProps, useForwardProps } from "radix-vue"
import { computed, type HTMLAttributes } from "vue"

interface HeadingSlot {
  headingValue: string
}

const props = defineProps<CalendarHeadingProps & { class?: HTMLAttributes["class"] }>()

defineSlots<{
  default(props: HeadingSlot): void
}>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props
  return delegated
})

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <CalendarHeading
    :class="cn('text-sm font-medium', props.class)"
    v-bind="forwardedProps"
  >
    <template #default="{ headingValue }">
      <slot :heading-value="headingValue">
        {{ headingValue }}
      </slot>
    </template>
  </CalendarHeading>
</template>
