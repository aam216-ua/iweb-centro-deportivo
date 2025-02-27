import DataTableColumnHeader from "@/components/DataTableColumnHeader.vue"
import { Badge } from "@/components/ui/badge"
import { roleLabels } from "@/lib/role"
import { getStatusConfig } from "@/lib/utils"
import type { User } from "@/types/user"
import { Status } from "@/types/user"
import type { ColumnDef } from "@tanstack/vue-table"
import { h } from "vue"
import DataTableRowActions from "./DataTableRowActions.vue"

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "email",
    header: ({ column }) => h(DataTableColumnHeader, { column, title: "Email" }),
    cell: ({ row }) => h("div", { class: "w-[180px] truncate font-medium" }, row.getValue("email")),
    enableSorting: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => h(DataTableColumnHeader, { column, title: "Nombre" }),
    cell: ({ row }) => h("div", { class: "truncate" }, row.getValue("name")),
  },
  {
    accessorKey: "surname",
    header: ({ column }) => h(DataTableColumnHeader, { column, title: "Apellidos" }),
    cell: ({ row }) => h("div", { class: "truncate" }, row.getValue("surname")),
  },
  {
    accessorKey: "phone",
    header: ({ column }) => h(DataTableColumnHeader, { column, title: "Teléfono" }),
    cell: ({ row }) => h("div", { class: "w-[120px]" }, row.getValue("phone")),
    enableSorting: false,
  },
  {
    accessorKey: "role",
    header: ({ column }) => h(DataTableColumnHeader, { column, title: "Rol" }),
    cell: ({ row }) => {
      const role = roleLabels[row.getValue("role") as keyof typeof roleLabels]
      return h("div", { class: "w-[150px]" }, [h(Badge, { variant: "outline" }, () => role)])
    },
    filterFn: (row, id, value: string[]) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => h(DataTableColumnHeader, { column, title: "Estado" }),
    cell: ({ row }) => {
      const status = row.getValue("status") as Status
      const config = getStatusConfig(status)

      return h("div", { class: "flex items-center gap-2" }, [
        h(config.icon, {
          class: `h-4 w-4 ${config.color}`,
        }),
        h(
          "span",
          {
            class: `inline-flex rounded-md px-2 py-1 text-xs font-medium ${config.bg} ${config.color}`,
          },
          config.label,
        ),
      ])
    },
    filterFn: (row, id, value: string[]) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: "actions",
    cell: ({ row }) => h(DataTableRowActions, { row }),
  },
]
