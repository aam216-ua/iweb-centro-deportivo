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
import { venuesService } from "@/services/venue"
import type { Booking } from "@/types/booking"
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
import BookingCreateDialog from "./BookingCreateDialog.vue"
import DataTablePagination from "./DataTablePagination.vue"

interface DataTableProps {
  columns: ColumnDef<Booking, unknown>[]
  data: Booking[]
}

const props = defineProps<DataTableProps>()
const showCreateDialog = ref(false)

const emit = defineEmits<{
  refresh: []
}>()

const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])
const columnVisibility = ref<VisibilityState>({})
const venues = ref<Venue[]>([])

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

const venueOptions = computed(() =>
  venues.value.map((venue) => ({
    label: venue.name,
    value: venue.id,
  })),
)

onMounted(async () => {
  const venuesResponse = await venuesService.getAll()
  venues.value = venuesResponse.data
})

const handleInputFilter = (column: string, value: string) => {
  table.getColumn(column)?.setFilterValue(value)
}

const onInput = (e: Event, column: string) => {
  const target = e.target as HTMLInputElement
  handleInputFilter(column, target.value)
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center gap-2">
      <div class="flex items-center gap-2 flex-wrap">
        <DataTableFacetedFilter
          v-if="table.getColumn('venue')"
          :column="table.getColumn('venue')"
          title="Pista"
          :options="venueOptions"
        />
        <div class="flex flex-col gap-2 sm:flex-row">
          <Input
            placeholder="Filtrar por cliente..."
            :value="(table.getColumn('appointee')?.getFilterValue() as string) ?? ''"
            class="max-w-[200px]"
            @input="(e: Event) => onInput(e, 'appointee')"
          />
          <Input
            placeholder="Filtrar por reservador..."
            :value="(table.getColumn('appointer')?.getFilterValue() as string) ?? ''"
            class="max-w-[200px]"
            @input="(e: Event) => onInput(e, 'appointer')"
          />
        </div>
      </div>
      <Button class="ml-auto whitespace-nowrap" @click="showCreateDialog = true">
        <Plus class="h-4 w-4" />
        <span class="hidden md:inline-block ml-2">Nueva Reserva</span>
      </Button>

      <BookingCreateDialog v-model:open="showCreateDialog" @refresh="emit('refresh')" />
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
