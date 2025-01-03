<script setup lang="ts">
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Table } from "@tanstack/vue-table"
import { Settings2 } from "lucide-vue-next"

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>
}

defineProps<DataTableViewOptionsProps<unknown>>()
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="outline" size="sm" class="ml-auto h-8">
        <Settings2 class="mr-2 h-4 w-4" />
        Ver
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="w-[150px]">
      <DropdownMenuCheckboxItem
        v-for="column in table.getAllColumns().filter((column) => column.getCanHide())"
        :key="column.id"
        :checked="column.getIsVisible()"
        @select="column.toggleVisibility(!column.getIsVisible())"
      >
        {{ column.id }}
      </DropdownMenuCheckboxItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
