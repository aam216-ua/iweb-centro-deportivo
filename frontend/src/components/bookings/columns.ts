import DataTableColumnHeader from "@/components/DataTableColumnHeader.vue"
import { Badge } from "@/components/ui/badge"
import { usersService } from "@/services/user"
import { venuesService } from "@/services/venue"
import type { Booking } from "@/types/booking"
import type { ColumnDef, Row } from "@tanstack/vue-table"
import { Clock } from "lucide-vue-next"
import { h, onMounted, ref } from "vue"
import DataTableRowActions from "./DataTableRowActions.vue"

const users = ref(new Map())
const venues = ref(new Map())

onMounted(async () => {
  const [usersResponse, venuesResponse] = await Promise.all([
    usersService.getAll(),
    venuesService.getAll(),
  ])

  usersResponse.data.forEach((user) => {
    users.value.set(user.id, user)
  })

  venuesResponse.data.forEach((venue) => {
    venues.value.set(venue.id, venue)
  })
})

export const columns: ColumnDef<Booking>[] = [
  {
    accessorKey: "date",
    header: ({ column }) => h(DataTableColumnHeader, { column, title: "Fecha" }),
    cell: ({ row }) => {
      const date = new Date(row.getValue("date"))
      return date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    },
  },
  {
    accessorKey: "turn",
    header: ({ column }) => h(DataTableColumnHeader, { column, title: "Turno" }),
    cell: ({ row }) => {
      const turn = row.getValue("turn")
      return h(Badge, { variant: "outline" }, () => [h(Clock, { class: "size-2.5 mr-1" }), turn])
    },
  },
  {
    id: "venue",
    header: ({ column }) => h(DataTableColumnHeader, { column, title: "Pista" }),
    accessorFn: (row) => venues.value.get(row.venueId)?.name,
    filterFn: (row: Row<Booking>, id, value: string[]) => {
      if (!value.length) return true
      return value.includes(row.original.venueId || "")
    },
  },
  {
    id: "appointee",
    header: ({ column }) => h(DataTableColumnHeader, { column, title: "Cliente" }),
    accessorFn: (row) => users.value.get(row.appointeeId)?.name,
    filterFn: (row: Row<Booking>, id, value: string[]) => {
      if (!value.length) return true
      return value.includes(row.original.appointeeId || "")
    },
  },
  {
    id: "appointer",
    header: ({ column }) => h(DataTableColumnHeader, { column, title: "Reservado por" }),
    accessorFn: (row) => users.value.get(row.appointerId)?.name,
  },
  {
    id: "actions",
    cell: ({ row }) => h(DataTableRowActions, { row }),
  },
]
