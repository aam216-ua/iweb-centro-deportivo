import DataTableColumnHeader from "@/components/DataTableColumnHeader.vue"
import { Badge } from "@/components/ui/badge"
import type { Booking } from "@/types/booking"
import type { ColumnDef, Row } from "@tanstack/vue-table"
import { Clock,  BookUser} from "lucide-vue-next"
import { RouterLink } from "vue-router"
import { h } from "vue"
import DataTableRowActions from "./DataTableRowActions.vue"

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
      return h(Badge, { variant: "outline" }, () => [
        h(Clock, { class: "size-2.5 mr-1" }),
        turn
      ])
    },
  },
  {
    id: "venue",
    accessorFn: (row) => row.venue?.id,
    header: ({ column }) => h(DataTableColumnHeader, { column, title: "Pista" }),
    cell: ({ row }) => {
      const venue = row.original.venue?.name || "Sin pista"
      return h("div", {}, venue)
    },
    filterFn: (row, id, value: string[]) => {
      if (!value.length) return true
      return value.includes(row.original.venue?.id || "")
    },
  },
  {
    id: "appointee",
    header: ({ column }) => h(DataTableColumnHeader, { column, title: "Cliente" }),
    cell: ({ row }) => {
      const appointee = row.original.appointee
      return h('div', { class: 'flex items-center gap-2' }, [
        h('span', {}, appointee?.name || 'N/A'),
        appointee?.id && h(RouterLink,
          {
            to: `/profile/${appointee.id}`,
            class: 'hover:text-primary'
          },
          () => h(BookUser, { class: 'size-3' })
        )
      ])
    },
    filterFn: (row, id, value: string) => {
      if (!value) return true
      const name = row.original.appointee?.name || ''
      return name.toLowerCase().includes(value.toLowerCase())
    },
  },
  {
    id: "appointer",
    header: ({ column }) => h(DataTableColumnHeader, { column, title: "Reservado por" }),
    cell: ({ row }) => {
      const appointer = row.original.appointer
      return h('div', { class: 'flex items-center gap-2' }, [
        h('span', {}, appointer?.name || 'N/A'),
        appointer?.id && h(RouterLink,
          {
            to: `/profile/${appointer.id}`,
            class: 'hover:text-primary'
          },
          () => h(BookUser, { class: 'size-3' })
        )
      ])
    },
    filterFn: (row, id, value: string) => {
      if (!value) return true
      const name = row.original.appointer?.name || ''
      return name.toLowerCase().includes(value.toLowerCase())
    },
  },
  {
    id: "actions",
    cell: ({ row }) => h(DataTableRowActions, { row }),
  },
]
