<script setup lang="ts">
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-vue-next"

interface Props {
  modelValue: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void
}>()

const toggleVisibility = () => {
  emit("update:modelValue", !props.modelValue)
}
</script>

<template>
  <Button
    class="absolute right-1.5 top-1.5 h-7 w-7"
    variant="outline"
    type="button"
    size="icon"
    @click.prevent="toggleVisibility"
  >
    <Eye v-if="!modelValue" class="text-muted-foreground" />
    <EyeOff v-else class="text-muted-foreground" />
  </Button>
</template>
