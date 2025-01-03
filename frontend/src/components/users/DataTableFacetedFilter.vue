<script setup lang="ts">
import { ref, computed } from "vue"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { Check, Plus } from "lucide-vue-next"
import type { Column } from "@tanstack/vue-table"
import type { User } from "@/types/user"

interface DataTableFacetedFilterProps {
  column?: Column<User, any>
  title?: string
  options: {
    label: string
    value: string
    icon?: any
  }[]
}

const props = defineProps<DataTableFacetedFilterProps>()
const selectedValues = computed(() => new Set(props.column?.getFilterValue() as string[]))
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button variant="outline" size="sm" class="h-10 border-dashed">
        <Plus class="mr-2 h-4 w-4" />
        {{ title }}
        <Separator v-if="selectedValues.size > 0" orientation="vertical" class="mx-2 h-4" />
        <div v-if="selectedValues.size > 0" class="flex space-x-1">
          <Badge
            v-for="option in options.filter(option => selectedValues.has(option.value))"
            :key="option.value"
            variant="secondary"
            class="rounded-sm px-1 font-normal"
          >
            {{ option.label }}
          </Badge>
        </div>
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-[200px] p-0" align="start">
      <Command>
        <CommandInput :placeholder="title" />
        <CommandList>
          <CommandEmpty>No hay resultados.</CommandEmpty>
          <CommandGroup>
            <CommandItem
              v-for="option in options"
              :key="option.value"
              :value="option"
              @select="() => {
                const isSelected = selectedValues.has(option.value)
                if (isSelected) {
                  selectedValues.delete(option.value)
                }
                else {
                  selectedValues.add(option.value)
                }
                const filterValues = Array.from(selectedValues)
                column?.setFilterValue(
                  filterValues.length ? filterValues : undefined,
                )
              }"
            >
              <div
                :class="cn(
                  'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                  selectedValues.has(option.value)
                    ? 'bg-primary text-primary-foreground'
                    : 'opacity-50 [&_svg]:invisible',
                )"
              >
                <Check :class="cn('h-4 w-4')" />
              </div>
              <span>{{ option.label }}</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator v-if="selectedValues.size > 0" />
          <CommandGroup v-if="selectedValues.size > 0">
            <CommandItem
              class="justify-center text-center"
              @select="column?.setFilterValue(undefined)"
            >
              Limpiar filtros
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>
