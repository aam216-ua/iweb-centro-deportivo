import type { Activity } from "@/types/activity"
import type { ColumnDef } from "@tanstack/vue-table"
import { h } from "vue"
import DataTableColumnHeader from "@/components/DataTableColumnHeader.vue"

export const columns: ColumnDef<Activity>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => h(DataTableColumnHeader, { column, title: "ID" }),
    enableSorting: false,
    cell: ({ row }) => h("div", { class: "font-medium" }, row.getValue("id")),
  },
  {
    accessorKey: "name",
    header: ({ column }) => h(DataTableColumnHeader, { column, title: "Nombre" }),
    cell: ({ row }) => h("div", { class: "font-medium" }, row.getValue("name")),
  },
]
