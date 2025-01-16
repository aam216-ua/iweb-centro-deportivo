<script setup lang="ts">
import PasswordToggleButton from "@/components/PasswordVisibility.vue"
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
import { passwordSchema, settingsSchema } from "@/schemas/settings"
import { usersService } from "@/services/user"
import { useAuthStore } from "@/stores/auth"
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
const loadingPassword = ref(false)
const authStore = useAuthStore()

// Password visibility toggles
const showPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

const profileForm = useForm({
  validationSchema: settingsSchema,
})

const roleForm = useForm()
const statusForm = useForm()
const passwordForm = useForm({
  validationSchema: passwordSchema,
})

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

const currentPasswordField = reactive(
  useField<string>("password", undefined, {
    form: passwordForm,
  }),
)

const newPasswordField = reactive(
  useField<string>("newPassword", undefined, {
    form: passwordForm,
  }),
)

const confirmPasswordField = reactive(
  useField<string>("confirmPassword", undefined, {
    form: passwordForm,
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

const onSubmitPassword = passwordForm.handleSubmit(async (values) => {
  try {
    loadingPassword.value = true
    await authStore.updatePassword({
      ...values,
      email: props.user.email,
    })
    passwordForm.resetForm()
    toast.success("Contraseña actualizada exitosamente")
    emit("userEdited")
  } catch (error) {
    toast.error("No se pudo actualizar la contraseña")
  } finally {
    loadingPassword.value = false
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
        <TabsList class="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="role">Rol</TabsTrigger>
          <TabsTrigger value="status">Estado</TabsTrigger>
          <TabsTrigger value="password">Contraseña</TabsTrigger>
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
              <Button variant="outline" @click="$emit('update:open', false)">Cancelar</Button>
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
              <Select v-model="roleField.value" :name="roleField.name" @blur="roleField.handleBlur">
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un rol" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem
                      v-for="option in roleOptions"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage>{{ roleField.errorMessage }}</FormMessage>
            </FormItem>

            <div class="flex justify-between pt-4">
              <Button variant="outline" @click="$emit('update:open', false)">Cancelar</Button>
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
                    <SelectItem
                      v-for="option in statusOptions"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage>{{ statusField.errorMessage }}</FormMessage>
            </FormItem>

            <div class="flex justify-between pt-4">
              <Button variant="outline" @click="$emit('update:open', false)">Cancelar</Button>
              <Button type="submit" :disabled="loadingStatus">
                <Loader2 v-if="loadingStatus" class="mr-2 h-4 w-4 animate-spin" />
                {{ loadingStatus ? "Guardando..." : "Guardar" }}
              </Button>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="password">
          <form @submit.prevent="onSubmitPassword" class="space-y-4">
            <FormItem>
              <FormLabel>Contraseña Actual</FormLabel>
              <div class="relative">
                <FormControl>
                  <Input
                    class="pr-10"
                    :type="showPassword ? 'text' : 'password'"
                    v-model="currentPasswordField.value"
                    :name="currentPasswordField.name"
                    @blur="currentPasswordField.handleBlur"
                  />
                </FormControl>
                <PasswordToggleButton v-model="showPassword" />
              </div>
              <FormMessage>{{ currentPasswordField.errorMessage }}</FormMessage>
            </FormItem>

            <FormItem>
              <FormLabel>Nueva Contraseña</FormLabel>
              <div class="relative">
                <FormControl>
                  <Input
                    class="pr-10"
                    :type="showNewPassword ? 'text' : 'password'"
                    v-model="newPasswordField.value"
                    :name="newPasswordField.name"
                    @blur="newPasswordField.handleBlur"
                  />
                </FormControl>
                <PasswordToggleButton v-model="showNewPassword" />
              </div>
              <FormMessage>{{ newPasswordField.errorMessage }}</FormMessage>
            </FormItem>

            <ul class="list-inside list-disc text-xs text-muted-foreground">
              <li>Debe contener entre 8 y 64 caracteres</li>
              <li>Debe contener alguna mayúscula [A-Z]</li>
              <li>Debe contener alguna minúscula [a-z]</li>
              <li>Debe contener algún dígito [0-9]</li>
              <li>Debe contener algún símbolo [!@#$%^&*]</li>
            </ul>

            <FormItem>
              <FormLabel>Confirmar Nueva Contraseña</FormLabel>
              <div class="relative">
                <FormControl>
                  <Input
                    class="pr-10"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    v-model="confirmPasswordField.value"
                    :name="confirmPasswordField.name"
                    @blur="confirmPasswordField.handleBlur"
                  />
                </FormControl>
                <PasswordToggleButton v-model="showConfirmPassword" />
              </div>
              <FormMessage>{{ confirmPasswordField.errorMessage }}</FormMessage>
            </FormItem>

            <div class="flex justify-between pt-4">
              <Button variant="outline" @click="$emit('update:open', false)">Cancelar</Button>
              <Button type="submit" :disabled="loadingPassword">
                <Loader2 v-if="loadingPassword" class="mr-2 h-4 w-4 animate-spin" />
                {{ loadingPassword ? "Guardando..." : "Guardar" }}
              </Button>
            </div>
          </form>
        </TabsContent>
      </Tabs>
    </DialogContent>
  </Dialog>
</template>
