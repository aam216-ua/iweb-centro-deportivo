<script setup lang="ts">
import PasswordToggleButton from "@/components/PasswordToggleButton.vue"
import PhoneInput from "@/components/PhoneInput.vue"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import log from "@/lib/log"
import { registerSchema } from "@/schemas/auth.schema"
import { authService } from "@/services/auth.service"
import { Eye, EyeOff, Loader2 } from "lucide-vue-next"
import { useForm } from "vee-validate"
import { ref } from "vue"
import { useRouter } from "vue-router"
import { toast } from "vue-sonner"

const router = useRouter()
const loading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const phonePrefix = ref("+34")

const form = useForm({
  validationSchema: registerSchema,
})

const onSubmit = form.handleSubmit(async (values) => {
  try {
    loading.value = true
    values.telefono = `${phonePrefix.value} ${values.telefono}`
    console.log(values)
    await authService.register(values)
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
  <Card class="mx-auto max-w-sm">
    <CardHeader>
      <CardTitle class="text-2xl"> Crear Cuenta </CardTitle>
      <CardDescription> Ingresa tus datos para crear una cuenta </CardDescription>
    </CardHeader>
    <CardContent>
      <form @submit="onSubmit" class="grid gap-4">
        <div class="grid grid-cols-2 gap-4">
          <FormField v-slot="{ componentField, errorMessage }" name="nombre">
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input v-bind="componentField" />
              </FormControl>
              <FormMessage>{{ errorMessage }}</FormMessage>
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField, errorMessage }" name="apellidos">
            <FormItem>
              <FormLabel>Apellidos</FormLabel>
              <FormControl>
                <Input v-bind="componentField" />
              </FormControl>
              <FormMessage>{{ errorMessage }}</FormMessage>
            </FormItem>
          </FormField>
        </div>

        <FormField v-slot="{ componentField, errorMessage }" name="telefono">
          <FormItem>
            <FormLabel>Teléfono</FormLabel>
            <FormControl>
              <div class="flex flex-row gap-0">
                <PhoneInput v-model="phonePrefix" />
                <Input type="number" class="rounded-l-none border-l-0" v-bind="componentField" />
              </div>
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

        <ul class="list-disc list-inside text-xs text-muted-foreground">
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
          <router-link
            to="/login"
            tabindex="-1"
            class="text-primary underline-offset-4 hover:underline"
          >
            Iniciar sesión
          </router-link>
        </div>
      </form>
    </CardContent>
  </Card>
</template>
