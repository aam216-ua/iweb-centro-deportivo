<script setup lang="ts">
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-vue-next"
import { useRouter } from "vue-router"

const props = defineProps<{
  buttonClass?: string
}>()

const router = useRouter()
</script>

<template>
  <Sheet>
    <SheetTrigger as-child>
      <Button variant="ghost" size="icon" :class="buttonClass">
        <Menu class="h-6 w-6" />
        <span class="sr-only">Open menu</span>
      </Button>
    </SheetTrigger>
    <SheetContent side="left">
      <nav class="grid gap-6 py-6">
        <RouterLink to="#" class="text-lg font-medium">Información</RouterLink>
        <RouterLink to="#" class="text-lg font-medium">Hazte socio</RouterLink>
      </nav>
    </SheetContent>
  </Sheet>
</template>
