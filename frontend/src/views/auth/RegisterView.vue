<script setup lang="ts">
import PasswordToggleButton from "@/components/PasswordVisibility.vue"
import { Button } from "@/components/ui/button"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { randImage } from "@/lib/utils"
import { registerSchema } from "@/schemas/auth"
import { useAuthStore } from "@/stores/auth"
import { Loader2 } from "lucide-vue-next"
import { useForm } from "vee-validate"
import { ref } from "vue"
import { useRouter } from "vue-router"
import { toast } from "vue-sonner"

const bgImg = randImage()
const router = useRouter()
const loading = ref(false)
const showPassword = ref(false)
const authStore = useAuthStore()
const showConfirmPassword = ref(false)

const form = useForm({
  validationSchema: registerSchema,
})

const onSubmit = form.handleSubmit(async (values) => {
  try {
    loading.value = true
    await authStore.register(values)
    toast.success("Tu cuenta ha sido creada exitosamente.")
    router.push("/login")
  } catch (error) {
    toast.error("No se pudo crear la cuenta. Intenta nuevamente.")
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="grid min-h-svh w-full lg:grid-cols-2">
    <div class="max-h-svh overflow-y-auto">
      <div class="flex min-h-full items-center justify-center py-8">
        <div class="w-full max-w-[350px] px-4">
          <div class="grid gap-2 text-center">
            <h1 class="text-3xl font-bold">Crear Cuenta</h1>
            <p class="text-balance text-muted-foreground">
              Ingresa tus datos para crear una cuenta
            </p>
          </div>

          <form @submit="onSubmit" class="mt-6 grid gap-4">
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
                  <Input type="text" v-bind="componentField" />
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

            <FormField v-slot="{ componentField, errorMessage }" name="password">
              <FormItem>
                <FormLabel>Contraseña</FormLabel>
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

            <ul class="list-inside list-disc text-xs text-muted-foreground">
              <li>Debe contener entre 8 y 64 caracteres</li>
              <li>Debe contener alguna mayúscula [A-Z]</li>
              <li>Debe contener alguna minúscula [a-z]</li>
              <li>Debe contener algún dígito [0-9]</li>
              <li>Debe contener algún símbolo [!@#$%^&*]</li>
            </ul>

            <FormField v-slot="{ componentField, errorMessage }" name="confirmPassword">
              <FormItem>
                <FormLabel>Confirmar Contraseña</FormLabel>
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

            <Button type="submit" class="w-full" :disabled="loading">
              <Loader2 v-if="loading" class="mr-2 h-4 w-4 animate-spin" />
              {{ loading ? "Creando cuenta..." : "Crear cuenta" }}
            </Button>

            <div class="mt-4 text-center text-sm text-muted-foreground">
              ¿Ya tienes una cuenta?
              <router-link to="/login" class="text-primary underline-offset-4 hover:underline">
                Iniciar sesión
              </router-link>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div class="hidden lg:block relative">
      <img
        :src="bgImg"
        alt="Image"
        width="1920"
        height="1080"
        class="absolute inset-0 h-svh w-full object-cover dark:brightness-[0.2] dark:grayscale"
      />
    </div>
  </div>
</template>
