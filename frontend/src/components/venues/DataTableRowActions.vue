<script setup lang="ts">
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { venuesService } from "@/services/venue"
import type { Venue } from "@/types/venue"
import type { Row } from "@tanstack/vue-table"
import { MoreHorizontal, Pencil, Trash } from "lucide-vue-next"
import { ref } from "vue"
import { toast } from "vue-sonner"

interface DataTableRowActionsProps {
  row: Row<Venue>
}

defineProps<DataTableRowActionsProps>()

const emit = defineEmits<{
  refresh: []
}>()

const loading = ref(false)

async function onDelete(id: string) {
  try {
    loading.value = true
    await venuesService.delete(id)
    emit("refresh")
    toast.success("Pista eliminada exitosamente")
  } catch {
    toast.error("No se pudo eliminar la pista")
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
      <DropdownMenuItem class="cursor-pointer">
        <Pencil class="mr-2 h-4 w-4" />
        Editar
      </DropdownMenuItem>
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
