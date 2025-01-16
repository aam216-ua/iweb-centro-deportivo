<script setup lang="ts">
import PasswordToggleButton from "@/components/PasswordVisibility.vue"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { passwordSchema, settingsSchema } from "@/schemas/settings"
import { usersService } from "@/services/user"
import { useAuthStore } from "@/stores/auth"
import { Loader2 } from "lucide-vue-next"
import { useField, useForm } from "vee-validate"
import { computed, reactive, ref } from "vue"
import { useRouter } from "vue-router"
import { toast } from "vue-sonner"

const loading = ref(false)
const loadingPassword = ref(false)
const loadingDelete = ref(false)
const showPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)
const authStore = useAuthStore()
const router = useRouter()

const user = computed(() => authStore.user)

const profileForm = useForm({
  validationSchema: settingsSchema,
})

const nameField = reactive(
  useField<string>("name", undefined, {
    form: profileForm,
    initialValue: user.value?.name || "",
  }),
)

const surnameField = reactive(
  useField<string>("surname", undefined, {
    form: profileForm,
    initialValue: user.value?.surname || "",
  }),
)

const phoneField = reactive(
  useField<string>("phone", undefined, {
    form: profileForm,
    initialValue: user.value?.phone.replace("+34", "").trim() || "",
  }),
)

const emailField = reactive(
  useField<string>("email", undefined, {
    form: profileForm,
    initialValue: user.value?.email || "",
  }),
)

const passwordForm = useForm({
  validationSchema: passwordSchema,
})

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

const onSubmitProfile = profileForm.handleSubmit(async (values) => {
  try {
    loading.value = true
    if (!user.value?.id) throw {}
    await authStore.updateProfile(values, user?.value.id)
    toast.success("Perfil actualizado exitosamente")
  } catch (error) {
    toast.error("No se pudo actualizar el perfil. Intenta nuevamente.")
  } finally {
    loading.value = false
  }
})

const onSubmitPassword = passwordForm.handleSubmit(async (values) => {
  try {
    loadingPassword.value = true
    await authStore.updatePassword({
      ...values,
      email: user.value?.email || "",
    })
    toast.success("Contraseña actualizada exitosamente")
    passwordForm.resetForm()
  } catch (error) {
    toast.error("No se pudo actualizar la contraseña. Intenta nuevamente.")
  } finally {
    loadingPassword.value = false
  }
})

const onDeleteAccount = async () => {
  try {
    loadingDelete.value = true
    if (!user.value?.id) throw new Error("No user ID")
    await usersService.delete(user.value.id)
    await authStore.logout()
    router.push("/login")
    toast.success("Cuenta eliminada exitosamente")
  } catch (error) {
    toast.error("No se pudo eliminar la cuenta. Intenta nuevamente.")
    loadingDelete.value = false
  }
}
</script>

<template>
  <div class="container mx-auto py-8">
    <div class="grid gap-8">
      <section>
        <div class="grid gap-2">
          <h1 class="text-2xl sm:text-3xl font-bold">Ajustes de Perfil</h1>
          <p class="text-balance text-muted-foreground">Actualiza tu información personal</p>
        </div>

        <form @submit="onSubmitProfile" class="mt-6 max-w-xl space-y-6">
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

          <div class="grid grid-cols-2 gap-4">
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
          </div>

          <Button type="submit" class="w-full" :disabled="loading">
            <Loader2 v-if="loading" class="mr-2 h-4 w-4 animate-spin" />
            {{ loading ? "Actualizando datos..." : "Guardar datos" }}
          </Button>
        </form>
      </section>

      <section class="border-t pt-8">
        <div class="grid gap-2">
          <h2 class="text-2xl font-bold">Cambiar Contraseña</h2>
          <p class="text-balance text-muted-foreground">Actualiza tu contraseña de acceso</p>
        </div>

        <form @submit="onSubmitPassword" class="mt-6 max-w-xl space-y-6">
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

          <Button type="submit" class="w-full" :disabled="loadingPassword">
            <Loader2 v-if="loadingPassword" class="mr-2 h-4 w-4 animate-spin" />
            {{ loadingPassword ? "Actualizando contraseña..." : "Cambiar contraseña" }}
          </Button>
        </form>
      </section>

      <section class="border-t pt-8">
        <div class="grid gap-2">
          <h2 class="text-2xl font-bold">Eliminar Cuenta</h2>
          <p class="text-balance text-muted-foreground">
            Esta acción eliminará permanentemente tu cuenta y todos tus datos
          </p>
        </div>

        <div class="mt-6">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" class="w-full max-w-xl"> Darse de baja </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se puede deshacer. Se eliminarán permanentemente todos tus datos y
                  no podrás recuperar tu cuenta.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  class="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  :disabled="loadingDelete"
                  @click="onDeleteAccount"
                >
                  <Loader2 v-if="loadingDelete" class="mr-2 h-4 w-4 animate-spin" />
                  {{ loadingDelete ? "Eliminando cuenta..." : "Sí, eliminar cuenta" }}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </section>
    </div>
  </div>
</template>
