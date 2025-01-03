<script setup lang="ts">
import { Button } from "@/components/ui/button"
import type { Venue } from "@/types/venue"
import type { Column } from "@tanstack/vue-table"
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-vue-next"

interface DataTableColumnHeaderProps {
  column: Column<Venue, unknown>
  title: string
}

defineProps<DataTableColumnHeaderProps>()
</script>

<template>
  <div class="flex items-center space-x-2">
    <Button
      variant="ghost"
      size="sm"
      class="-ml-3 h-8 data-[state=open]:bg-accent"
      @click="column.toggleSorting(column.getIsSorted() === 'asc')"
    >
      {{ title }}
      <template v-if="column.getIsSorted() === 'desc'">
        <ChevronDown class="ml-2 h-4 w-4" />
      </template>
      <template v-else-if="column.getIsSorted() === 'asc'">
        <ChevronUp class="ml-2 h-4 w-4" />
      </template>
      <template v-else>
        <ChevronsUpDown class="ml-2 h-4 w-4" />
      </template>
    </Button>
  </div>
</template>
