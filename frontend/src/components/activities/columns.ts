import type { Activity } from "@/types/activity"
import type { ColumnDef } from "@tanstack/vue-table"
import { h } from "vue"
import DataTableColumnHeader from "./DataTableColumnHeader.vue"

export const columns: ColumnDef<Activity>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return h(DataTableColumnHeader, {
        column,
        title: "ID",
      })
    },
    cell: ({ row }) => {
      const id = row.getValue("id") as string
      return id
    },
    enableSorting: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return h(DataTableColumnHeader, {
        column,
        title: "Nombre",
      })
    },
    filterFn: (row, id, value) => {
      const val = row.getValue(id)
      return typeof val === "string"
        ? val.toLowerCase().includes((value as string).toLowerCase())
        : false
    },
  },
]
