<script setup lang="ts">
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { bookingsService } from "@/services/booking"
import type { Booking } from "@/types/booking"
import type { Row } from "@tanstack/vue-table"
import { MoreHorizontal, Trash } from "lucide-vue-next"
import { ref } from "vue"
import { toast } from "vue-sonner"

interface DataTableRowActionsProps {
  row: Row<Booking>
}

defineProps<DataTableRowActionsProps>()

const emit = defineEmits<{
  refresh: []
}>()

const loading = ref(false)

async function onDelete(id: string) {
  try {
    loading.value = true
    await bookingsService.delete(id)
    emit("refresh")
    toast.success("Reserva eliminada exitosamente")
  } catch {
    toast.error("No se pudo eliminar la reserva")
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" class="h-8 w-8 p-0">
        <MoreHorizontal class="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem
        class="cursor-pointer text-destructive"
        :disabled="loading"
        @click="onDelete(row.original.id)"
      >
        <Trash class="mr-2 h-4 w-4" />
        Eliminar
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
