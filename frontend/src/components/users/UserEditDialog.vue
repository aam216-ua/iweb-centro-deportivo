<script setup lang="ts">
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { settingsSchema } from "@/schemas/settings"
import { useAuthStore } from "@/stores/auth"
import { usersService } from "@/services/user"
import type { User } from "@/types/user"
import { Role, Status } from "@/types/user"
import { Loader2 } from "lucide-vue-next"
import { useField, useForm } from "vee-validate"
import { reactive, ref } from "vue"
import { toast } from "vue-sonner"

const props = defineProps<{
  open: boolean
  user: User
}>()

const emit = defineEmits<{
  userEdited: []
  "update:open": [value: boolean]
}>()

const loadingProfile = ref(false)
const loadingRole = ref(false)
const loadingStatus = ref(false)
const authStore = useAuthStore()

const profileForm = useForm({
  validationSchema: settingsSchema,
})

const roleForm = useForm()
const statusForm = useForm()

const nameField = reactive(
  useField<string>("name", undefined, {
    form: profileForm,
    initialValue: props.user.name,
  }),
)

const surnameField = reactive(
  useField<string>("surname", undefined, {
    form: profileForm,
    initialValue: props.user.surname,
  }),
)

const phoneField = reactive(
  useField<string>("phone", undefined, {
    form: profileForm,
    initialValue: props.user.phone.replace("+34", "").trim(),
  }),
)

const emailField = reactive(
  useField<string>("email", undefined, {
    form: profileForm,
    initialValue: props.user.email,
  }),
)

const roleField = reactive(
  useField<Role>("role", undefined, {
    form: roleForm,
    initialValue: props.user.role,
  }),
)

const statusField = reactive(
  useField<Status>("status", undefined, {
    form: statusForm,
    initialValue: props.user.status,
  }),
)

const roleOptions = [
  { label: "Super Admin", value: Role.SUPERADMIN },
  { label: "Admin", value: Role.ADMIN },
  { label: "Recepcionista", value: Role.RECEPTIONIST },
  { label: "Cliente", value: Role.CUSTOMER },
]

const statusOptions = [
  { label: "Pendiente", value: Status.pending },
  { label: "Bloqueado", value: Status.blocked },
  { label: "Creado", value: Status.created },
]

const onSubmitProfile = profileForm.handleSubmit(async (values) => {
  try {
    loadingProfile.value = true
    await authStore.updateProfile(values, props.user.id)
    toast.success("Perfil actualizado exitosamente")
    emit("userEdited")
  } catch (error) {
    toast.error("No se pudo actualizar el perfil")
  } finally {
    loadingProfile.value = false
  }
})

const onSubmitRole = roleForm.handleSubmit(async (values) => {
  try {
    loadingRole.value = true
    await usersService.updateRole(props.user.id, values.role)
    toast.success("Rol actualizado exitosamente")
    emit("userEdited")
  } catch (error) {
    toast.error("No se pudo actualizar el rol")
  } finally {
    loadingRole.value = false
  }
})

const onSubmitStatus = statusForm.handleSubmit(async (values) => {
  try {
    loadingStatus.value = true
    await usersService.updateStatus(props.user.id, values.status)
    toast.success("Estado actualizado exitosamente")
    emit("userEdited")
  } catch (error) {
    toast.error("No se pudo actualizar el estado")
  } finally {
    loadingStatus.value = false
  }
})
</script>

<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Editar Usuario</DialogTitle>
      </DialogHeader>

      <Tabs defaultValue="profile" class="w-full">
        <TabsList class="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="role">Rol</TabsTrigger>
          <TabsTrigger value="status">Estado</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <form @submit.prevent="onSubmitProfile" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input
                    v-model="nameField.value"
                    :name="nameField.name"
                    @blur="nameField.handleBlur"
                  />
                </FormControl>
                <FormMessage>{{ nameField.errorMessage }}</FormMessage>
              </FormItem>

              <FormItem>
                <FormLabel>Apellidos</FormLabel>
                <FormControl>
                  <Input
                    v-model="surnameField.value"
                    :name="surnameField.name"
                    @blur="surnameField.handleBlur"
                  />
                </FormControl>
                <FormMessage>{{ surnameField.errorMessage }}</FormMessage>
              </FormItem>
            </div>

            <FormItem>
              <FormLabel>Teléfono</FormLabel>
              <FormControl>
                <Input
                  type="tel"
                  v-model="phoneField.value"
                  :name="phoneField.name"
                  @blur="phoneField.handleBlur"
                />
              </FormControl>
              <FormMessage>{{ phoneField.errorMessage }}</FormMessage>
            </FormItem>

            <FormItem>
              <FormLabel>Correo Electrónico</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  v-model="emailField.value"
                  :name="emailField.name"
                  @blur="emailField.handleBlur"
                />
              </FormControl>
              <FormMessage>{{ emailField.errorMessage }}</FormMessage>
            </FormItem>

            <div class="flex gap-4 justify-end pt-4">
              <Button variant="outline" @click="$emit('update:open', false)">
                Cancelar
              </Button>
              <Button type="submit" :disabled="loadingProfile">
                <Loader2 v-if="loadingProfile" class="mr-2 h-4 w-4 animate-spin" />
                {{ loadingProfile ? "Guardando..." : "Guardar" }}
              </Button>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="role">
          <form @submit.prevent="onSubmitRole" class="space-y-4">
            <FormItem>
              <FormLabel>Rol</FormLabel>
              <Select
                v-model="roleField.value"
                :name="roleField.name"
                @blur="roleField.handleBlur"
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un rol" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem v-for="option in roleOptions" :key="option.value" :value="option.value">
                      {{ option.label }}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage>{{ roleField.errorMessage }}</FormMessage>
            </FormItem>

            <div class="flex justify-between pt-4">
              <Button variant="outline" @click="$emit('update:open', false)">
                Cancelar
              </Button>
              <Button type="submit" :disabled="loadingRole">
                <Loader2 v-if="loadingRole" class="mr-2 h-4 w-4 animate-spin" />
                {{ loadingRole ? "Guardando..." : "Guardar" }}
              </Button>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="status">
          <form @submit.prevent="onSubmitStatus" class="space-y-4">
            <FormItem>
              <FormLabel>Estado</FormLabel>
              <Select
                v-model="statusField.value"
                :name="statusField.name"
                @blur="statusField.handleBlur"
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un estado" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem v-for="option in statusOptions" :key="option.value" :value="option.value">
                      {{ option.label }}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage>{{ statusField.errorMessage }}</FormMessage>
            </FormItem>

            <div class="flex justify-between pt-4">
              <Button variant="outline" @click="$emit('update:open', false)">
                Cancelar
              </Button>
              <Button type="submit" :disabled="loadingStatus">
                <Loader2 v-if="loadingStatus" class="mr-2 h-4 w-4 animate-spin" />
                {{ loadingStatus ? "Guardando..." : "Guardar" }}
              </Button>
            </div>
          </form>
        </TabsContent>
      </Tabs>
    </DialogContent>
  </Dialog>
</template>
