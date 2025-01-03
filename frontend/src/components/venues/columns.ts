import { Badge } from "@/components/ui/badge"
import type { Venue } from "@/types/venue"
import type { ColumnDef } from "@tanstack/vue-table"
import { h } from "vue"
import DataTableColumnHeader from "./DataTableColumnHeader.vue"
import DataTableRowActions from "./DataTableRowActions.vue"

export const columns: ColumnDef<Venue>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => h(DataTableColumnHeader, { column, title: "Nombre" }),
  },
  {
    id: "activity",
    accessorKey: "activity.name",
    header: ({ column }) => h(DataTableColumnHeader, { column, title: "Actividad" }),
    cell: ({ row }) => {
      const activity = row.original.activity?.name || "Sin actividad"
      return h(Badge, { variant: "outline" }, () => activity)
    },
  },
  {
    accessorKey: "capacity",
    header: ({ column }) => h(DataTableColumnHeader, { column, title: "Capacidad" }),
  },
  {
    accessorKey: "fee",
    header: ({ column }) => h(DataTableColumnHeader, { column, title: "Precio" }),
    cell: ({ row }) => {
      const fee = row.getValue("fee") as number
      return h("div", {}, `$${fee.toFixed(2)}`)
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => h(DataTableColumnHeader, { column, title: "Estado" }),
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return h(
        Badge,
        {
          variant: status === "available" ? "default" : "secondary",
        },
        () => (status === "available" ? "Disponible" : "No disponible"),
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => h(DataTableRowActions, { row }),
  },
]
