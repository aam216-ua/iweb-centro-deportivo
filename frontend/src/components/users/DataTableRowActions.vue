<script setup lang="ts">
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { usersService } from "@/services/user"
import type { User } from "@/types/user"
import type { Row } from "@tanstack/vue-table"
import { MoreHorizontal, Pencil, Trash } from "lucide-vue-next"
import { ref } from "vue"
import { toast } from "vue-sonner"
import UserEditDialog from "./UserEditDialog.vue"

interface DataTableRowActionsProps {
  row: Row<User>
}

defineProps<DataTableRowActionsProps>()

const emit = defineEmits<{
  refresh: []
}>()

const loading = ref(false)
const showEditDialog = ref(false)

async function onDelete(id: string) {
  try {
    loading.value = true
    await usersService.delete(id)
    emit("refresh")
    toast.success("Usuario eliminado exitosamente")
  } catch {
    toast.error("No se pudo eliminar el usuario")
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" class="h-8 w-8 p-0">
        <MoreHorizontal class="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem class="cursor-pointer" @click="showEditDialog = true">
        <Pencil class="mr-2 h-4 w-4" />
        Editar
      </DropdownMenuItem>
      <DropdownMenuItem
        class="cursor-pointer text-destructive"
        :disabled="loading"
        @click="onDelete(row.original.id)"
      >
        <Trash class="mr-2 h-4 w-4" />
        Eliminar
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>

  <UserEditDialog
    v-model:open="showEditDialog"
    :user="row.original"
    @user-edited="emit('refresh')"
  />
</template>
