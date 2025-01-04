import DataTableColumnHeader from "@/components/DataTableColumnHeader.vue"
import { Badge } from "@/components/ui/badge"
import type { Booking } from "@/types/booking"
import type { ColumnDef } from "@tanstack/vue-table"
import { h } from "vue"
import DataTableRowActions from "./DataTableRowActions.vue"

export const columns: ColumnDef<Booking>[] = [
  {
    accessorKey: "date",
    header: ({ column }) => h(DataTableColumnHeader, { column, title: "Fecha" }),
    cell: ({ row }) => {
      const date = new Date(row.getValue("date"))
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },
  },
  {
    accessorKey: "turn",
    header: ({ column }) => h(DataTableColumnHeader, { column, title: "Turno" }),
    cell: ({ row }) => {
      const turn = row.getValue("turn")
      return h(Badge, { variant: "outline" }, () => turn)
    },
  },
  {
    id: "venue",
    header: ({ column }) => h(DataTableColumnHeader, { column, title: "Pista" }),
    cell: ({ row }) => row.original.venue?.name || "N/A",
  },
  {
    id: "appointee",
    header: ({ column }) => h(DataTableColumnHeader, { column, title: "Cliente" }),
    cell: ({ row }) => row.original.appointee?.name || "N/A",
  },
  {
    id: "appointer",
    header: ({ column }) => h(DataTableColumnHeader, { column, title: "Reservado por" }),
    cell: ({ row }) => row.original.appointer?.name || "N/A",
  },
  {
    id: "actions",
    cell: ({ row }) => h(DataTableRowActions, { row }),
  },
]
