<script setup lang="ts">
import PasswordToggleButton from "@/components/PasswordVisibility.vue"
import { Button } from "@/components/ui/button"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { passwordSchema, settingsSchema } from "@/schemas/settings"
import { useAuthStore } from "@/stores/auth"
import { Loader2 } from "lucide-vue-next"
import { useForm } from "vee-validate"
import { ref } from "vue"
import { toast } from "vue-sonner"

const loading = ref(false)
const loadingPassword = ref(false)
const showPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)
const authStore = useAuthStore()

const profileForm = useForm({
  validationSchema: settingsSchema,
  initialValues: {
    email: authStore.user?.email,
    name: authStore.user?.name,
    surname: authStore.user?.surname,
    phone: authStore.user?.phone,
  },
})

const passwordForm = useForm({
  validationSchema: passwordSchema,
})

const onSubmitProfile = profileForm.handleSubmit(async (values) => {
  try {
    loading.value = true
    await authStore.updateProfile(values)
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
    await authStore.updatePassword(values.newPassword)
    toast.success("Contraseña actualizada exitosamente")
    passwordForm.resetForm()
  } catch (error) {
    toast.error("No se pudo actualizar la contraseña. Intenta nuevamente.")
  } finally {
    loadingPassword.value = false
  }
})
</script>

<template>
  <div class="container mx-auto py-8">
    <div class="grid gap-8">
      <section>
        <div class="grid gap-2">
          <h1 class="text-3xl font-bold">Ajustes de Perfil</h1>
          <p class="text-balance text-muted-foreground">Actualiza tu información personal</p>
        </div>

        <form @submit="onSubmitProfile" class="mt-6 max-w-xl space-y-6">
          <div class="grid gap-4">
            <div class="grid grid-cols-2 gap-4">
              <FormField v-slot="{ componentField, errorMessage }" name="name">
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input v-bind="componentField" />
                  </FormControl>
                  <FormMessage>{{ errorMessage }}</FormMessage>
                </FormItem>
              </FormField>

              <FormField v-slot="{ componentField, errorMessage }" name="surname">
                <FormItem>
                  <FormLabel>Apellidos</FormLabel>
                  <FormControl>
                    <Input v-bind="componentField" />
                  </FormControl>
                  <FormMessage>{{ errorMessage }}</FormMessage>
                </FormItem>
              </FormField>
            </div>

            <FormField v-slot="{ componentField, errorMessage }" name="phone">
              <FormItem>
                <FormLabel>Teléfono</FormLabel>
                <FormControl>
                  <Input type="tel" v-bind="componentField" />
                </FormControl>
                <FormMessage>{{ errorMessage }}</FormMessage>
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField, errorMessage }" name="email">
              <FormItem>
                <FormLabel>Correo Electrónico</FormLabel>
                <FormControl>
                  <Input type="email" v-bind="componentField" />
                </FormControl>
                <FormMessage>{{ errorMessage }}</FormMessage>
              </FormItem>
            </FormField>
          </div>

          <Button type="submit" class="w-full" :disabled="loading">
            <Loader2 v-if="loading" class="mr-2 h-4 w-4 animate-spin" />
            {{ loading ? "Actualizando..." : "Guardar cambios" }}
          </Button>
        </form>
      </section>

      <section class="border-t pt-8">
        <div class="grid gap-2">
          <h2 class="text-2xl font-bold">Cambiar Contraseña</h2>
          <p class="text-balance text-muted-foreground">Actualiza tu contraseña de acceso</p>
        </div>

        <form @submit="onSubmitPassword" class="mt-6 max-w-xl space-y-6">
          <FormField v-slot="{ componentField, errorMessage }" name="password">
            <FormItem>
              <FormLabel>Contraseña Actual</FormLabel>
              <div class="relative">
                <FormControl>
                  <Input
                    class="pr-10"
                    :type="showPassword ? 'text' : 'password'"
                    v-bind="componentField"
                  />
                </FormControl>
                <PasswordToggleButton v-model="showPassword" />
              </div>
              <FormMessage>{{ errorMessage }}</FormMessage>
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField, errorMessage }" name="newPassword">
            <FormItem>
              <FormLabel>Nueva Contraseña</FormLabel>
              <div class="relative">
                <FormControl>
                  <Input
                    class="pr-10"
                    :type="showNewPassword ? 'text' : 'password'"
                    v-bind="componentField"
                  />
                </FormControl>
                <PasswordToggleButton v-model="showNewPassword" />
              </div>
              <FormMessage>{{ errorMessage }}</FormMessage>
            </FormItem>
          </FormField>

          <ul class="list-inside list-disc text-xs text-muted-foreground">
            <li>Debe contener entre 8 y 64 caracteres</li>
            <li>Debe contener alguna mayúscula [A-Z]</li>
            <li>Debe contener alguna minúscula [a-z]</li>
            <li>Debe contener algún dígito [0-9]</li>
            <li>Debe contener algún símbolo [!@#$%^&*]</li>
          </ul>

          <FormField v-slot="{ componentField, errorMessage }" name="confirmPassword">
            <FormItem>
              <FormLabel>Confirmar Nueva Contraseña</FormLabel>
              <div class="relative">
                <FormControl>
                  <Input
                    class="pr-10"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    v-bind="componentField"
                  />
                </FormControl>
                <PasswordToggleButton v-model="showConfirmPassword" />
              </div>
              <FormMessage>{{ errorMessage }}</FormMessage>
            </FormItem>
          </FormField>

          <Button type="submit" class="w-full" :disabled="loadingPassword">
            <Loader2 v-if="loadingPassword" class="mr-2 h-4 w-4 animate-spin" />
            {{ loadingPassword ? "Actualizando contraseña..." : "Cambiar contraseña" }}
          </Button>
        </form>
      </section>
    </div>
  </div>
</template>
