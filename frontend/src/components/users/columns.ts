import type { ColumnDef } from "@tanstack/vue-table"
import {roleLabels} from "@/lib/role"
import { h } from "vue"
import type { User } from "@/types/user"
import { Checkbox } from "@/components/ui/checkbox"
import DataTableColumnHeader from "./DataTableColumnHeader.vue"
import DataTableRowActions from "./DataTableRowActions.vue"
import { Badge } from "@/components/ui/badge"

export const columns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => h(Checkbox, {
      "checked": table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate"),
      "onUpdate:checked": value => table.toggleAllPageRowsSelected(!!value),
      "ariaLabel": "Seleccionar todo",
    }),
    cell: ({ row }) => h(Checkbox, {
      "checked": row.getIsSelected(),
      "onUpdate:checked": value => row.toggleSelected(!!value),
      "ariaLabel": "Seleccionar fila",
    }),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "email",
    header: ({ column }) => h(DataTableColumnHeader, { column, title: "Email" }),
    cell: ({ row }) => h("div", { class: "w-[180px] truncate font-medium" }, row.getValue("email")),
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => h(DataTableColumnHeader, { column, title: "Nombre" }),
    cell: ({ row }) => h("div", { class: "truncate" }, row.getValue("name")),
    enableHiding: false,
  },
  {
    accessorKey: "surname",
    header: ({ column }) => h(DataTableColumnHeader, { column, title: "Apellidos" }),
    cell: ({ row }) => h("div", { class: "truncate" }, row.getValue("surname")),
    enableHiding: false,
  },
  {
    accessorKey: "phone",
    header: ({ column }) => h(DataTableColumnHeader, { column, title: "Teléfono" }),
    cell: ({ row }) => h("div", { class: "w-[120px]" }, row.getValue("phone")),
    enableHiding: false,
  },
  {
    accessorKey: "role",
    header: ({ column }) => h(DataTableColumnHeader, { column, title: "Rol" }),
    cell: ({ row }) => {
      const role = roleLabels[row.getValue("role") as keyof typeof roles]
      return h("div", { class: "w-[150px]" }, [
        h(Badge, {variant: "outline"}, role)
      ])
    },
    enableHiding: false,
  },
  {
    id: "actions",
    cell: ({ row }) => h(DataTableRowActions, { row }),
  },
]
