<script setup lang="ts">
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { User } from "@/types/user"
import type { Row } from "@tanstack/vue-table"
import { MoreHorizontal } from "lucide-vue-next"

interface DataTableRowActionsProps {
  row: Row<User>
}

defineProps<DataTableRowActionsProps>()
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" class="h-8 w-8 p-0">
        <span class="sr-only">Abrir menú</span>
        <MoreHorizontal class="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem> Editar </DropdownMenuItem>
      <DropdownMenuItem> Ver detalles </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem class="text-red-600"> Eliminar </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
