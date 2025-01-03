<script setup lang="ts">
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { User } from "@/types/user"
import type { Column } from "@tanstack/vue-table"
import { ArrowDown, ArrowDownUp, ArrowUp } from "lucide-vue-next"

interface DataTableColumnHeaderProps<TData> {
  column: Column<TData, unknown>
  title: string
}

defineProps<DataTableColumnHeaderProps<User>>()
</script>

<template>
  <div v-if="column.getCanSort()" class="flex items-center space-x-2">
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" class="-ml-3 h-8 data-[state=open]:bg-accent">
          <span>{{ title }}</span>
          <ArrowDown v-if="column.getIsSorted() === 'desc'" class="ml-2 h-4 w-4" />
          <ArrowUp v-else-if="column.getIsSorted() === 'asc'" class="ml-2 h-4 w-4" />
          <ArrowDownUp v-else class="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem @click="column.toggleSorting(false)">
          <ArrowUp class="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
          Ascendente
        </DropdownMenuItem>
        <DropdownMenuItem @click="column.toggleSorting(true)">
          <ArrowDown class="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
          Descendente
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
  <div v-else>
    {{ title }}
  </div>
</template>
