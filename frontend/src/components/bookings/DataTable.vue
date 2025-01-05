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
import { usersService } from "@/services/user"
import { venuesService } from "@/services/venue"
import type { Booking } from "@/types/booking"
import type { User } from "@/types/user"
import type { Venue } from "@/types/venue"
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
import { computed, onMounted, ref } from "vue"
import DataTablePagination from "./DataTablePagination.vue"

interface DataTableProps {
  columns: ColumnDef<Booking, unknown>[]
  data: Booking[]
}

const props = defineProps<DataTableProps>()
const emit = defineEmits<{
  create: []
  refresh: []
}>()

const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])
const columnVisibility = ref<VisibilityState>({})
const venues = ref<Venue[]>([])
const users = ref<User[]>([])

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
    emit("refresh")
  },
  onColumnFiltersChange: (updater) => {
    columnFilters.value = typeof updater === "function" ? updater(columnFilters.value) : updater
    emit("refresh")
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
})

const venueOptions = computed(() =>
  venues.value.map((venue) => ({
    label: venue.name,
    value: venue.id,
  })),
)

const userOptions = computed(() =>
  users.value.map((user) => ({
    label: user.name,
    value: user.id,
  })),
)

onMounted(async () => {
  venues.value = (await venuesService.getAll()).data
  users.value = (await usersService.getAll()).data
})
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center gap-2">
      <div class="flex items-center gap-2">
        <Input
          placeholder="Filtrar reservas..."
          :model-value="(table.getColumn('appointee')?.getFilterValue() as string) ?? ''"
          class="max-w-sm"
          @input="
            table.getColumn('appointee')?.setFilterValue(($event.target as HTMLInputElement).value)
          "
        />
        <DataTableFacetedFilter
          v-if="table.getColumn('venue')"
          :column="table.getColumn('venue')"
          title="Pista"
          :options="venueOptions"
        />
        <DataTableFacetedFilter
          v-if="table.getColumn('appointee')"
          :column="table.getColumn('appointee')"
          title="Usuario"
          :options="userOptions"
        />
      </div>
      <Button class="ml-auto" @click="$emit('create')">
        <Plus class="h-4 w-4" />
        <span class="hidden md:inline-block ml-2">Nueva Reserva</span>
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
