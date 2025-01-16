<script setup lang="ts">
import DataTableFacetedFilter from "@/components/DataTableFacetedFilter.vue"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { roleLabels } from "@/lib/role"
import type { User } from "@/types/user"
import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/vue-table"
import {
  FlexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
} from "@tanstack/vue-table"
import { Plus } from "lucide-vue-next"
import { ref } from "vue"
import DataTablePagination from "./DataTablePagination.vue"

interface DataTableProps {
  columns: ColumnDef<User, unknown>[]
  data: User[]
}

const props = defineProps<DataTableProps>()
const emit = defineEmits<{
  create: []
}>()

const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])
const columnVisibility = ref<VisibilityState>({})

const table = useVueTable({
  get data() {
    return props.data
  },
  get columns() {
    return props.columns
  },
  state: {
    get sorting() {
      return sorting.value
    },
    get columnFilters() {
      return columnFilters.value
    },
    get columnVisibility() {
      return columnVisibility.value
    },
  },
  onSortingChange: (updater) => {
    sorting.value = typeof updater === "function" ? updater(sorting.value) : updater
  },
  onColumnFiltersChange: (updater) => {
    columnFilters.value = typeof updater === "function" ? updater(columnFilters.value) : updater
  },
  onColumnVisibilityChange: (updater) => {
    columnVisibility.value =
      typeof updater === "function" ? updater(columnVisibility.value) : updater
  },
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFacetedRowModel: getFacetedRowModel(),
  getFacetedUniqueValues: getFacetedUniqueValues(),
  initialState: {
    pagination: {
      pageSize: 5,
    },
  },
})

const roleOptions = Object.entries(roleLabels).map(([value, label]) => ({
  label,
  value,
}))
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center gap-2">
      <div class="flex items-center gap-2">
        <Input
          placeholder="Filtrar por email..."
          :model-value="(table.getColumn('email')?.getFilterValue() as string) ?? ''"
          class="max-w-sm"
          @input="
            table.getColumn('email')?.setFilterValue(($event.target as HTMLInputElement).value)
          "
        />
        <Input
          placeholder="Filtrar por nombre..."
          :model-value="(table.getColumn('name')?.getFilterValue() as string) ?? ''"
          class="max-w-sm"
          @input="
            table.getColumn('name')?.setFilterValue(($event.target as HTMLInputElement).value)
          "
        />
        <Input
          placeholder="Filtrar por apellidos..."
          :model-value="(table.getColumn('surname')?.getFilterValue() as string) ?? ''"
          class="max-w-sm"
          @input="
            table.getColumn('surname')?.setFilterValue(($event.target as HTMLInputElement).value)
          "
        />
        <DataTableFacetedFilter
          v-if="table.getColumn('role')"
          :column="table.getColumn('role')"
          title="Rol"
          :options="roleOptions"
        />
      </div>
      <Button class="ml-auto" @click="$emit('create')">
        <Plus class="h-4 w-4" />
        <span class="hidden md:inline-block ml-2">Nuevo Usuario</span>
      </Button>
    </div>
    <div class="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
            <TableHead v-for="header in headerGroup.headers" :key="header.id">
              <FlexRender
                v-if="!header.isPlaceholder"
                :render="header.column.columnDef.header"
                :props="header.getContext()"
              />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="table.getRowModel().rows?.length">
            <TableRow v-for="row in table.getRowModel().rows" :key="row.id">
              <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id" class="py-1">
                <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
              </TableCell>
            </TableRow>
          </template>
          <template v-else>
            <TableRow>
              <TableCell :colspan="columns.length" class="h-24 text-center">
                No hay resultados.
              </TableCell>
            </TableRow>
          </template>
        </TableBody>
      </Table>
    </div>
    <DataTablePagination :table="table" />
  </div>
</template>
