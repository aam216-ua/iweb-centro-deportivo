<script setup lang="ts">
import PasswordToggleButton from "@/components/PasswordToggleButton.vue"
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
import { toast } from "@/components/ui/toast"
import { loginSchema } from "@/schemas/auth.schema"
import { useAuthStore } from "@/stores/auth.store"
import { vAutoAnimate } from "@formkit/auto-animate/vue"
import { Loader2 } from "lucide-vue-next"
import { useForm } from "vee-validate"
import { ref } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()
const authStore = useAuthStore()
const form = useForm({
  validationSchema: loginSchema,
})
const showPassword = ref(false)
const onSubmit = form.handleSubmit(async (values) => {
  try {
    await authStore.login(values.email, values.password)
    toast({
      title: "¡Bienvenido!",
      description: "Has iniciado sesión correctamente.",
    })
    router.push("/")
  } catch (error) {
    toast({
      title: "Error",
      description: "Credenciales inválidas",
      variant: "destructive",
    })
  }
})
</script>

<template>
  <Card class="mx-auto max-w-sm">
    <CardHeader>
      <CardTitle class="text-2xl"> Iniciar Sesión </CardTitle>
      <CardDescription> Ingresa tu email para acceder a tu cuenta </CardDescription>
    </CardHeader>
    <CardContent>
      <form @submit="onSubmit" class="grid gap-4">
        <FormField v-slot="{ componentField, errorMessage }" name="email">
          <FormItem v-auto-animate>
            <FormLabel>Correo Electrónico</FormLabel>
            <FormControl>
              <Input type="email" v-bind="componentField" />
            </FormControl>
            <FormMessage>{{ errorMessage }}</FormMessage>
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField, errorMessage }" name="password">
          <FormItem v-auto-animate>
            <div class="flex items-center justify-between">
              <FormLabel>Contraseña</FormLabel>
              <router-link
                to="/recover"
                class="text-sm text-muted-foreground underline-offset-4 hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </router-link>
            </div>
            <div class="relative">
              <FormControl>
                <Input :type="showPassword ? 'text' : 'password'" v-bind="componentField" />
              </FormControl>
              <PasswordToggleButton v-model="showPassword" />
            </div>
            <FormMessage>{{ errorMessage }}</FormMessage>
          </FormItem>
        </FormField>
        <Button type="submit" class="w-full" :disabled="authStore.loading">
          <Loader2 v-if="authStore.loading" class="mr-2 h-4 w-4 animate-spin" />
          {{ authStore.loading ? "Iniciando sesión..." : "Ingresar" }}
        </Button>
        <div class="mt-4 text-center text-sm text-muted-foreground">
          ¿No tienes una cuenta?
          <router-link to="/register" class="text-primary underline-offset-4 hover:underline">
            Regístrate
          </router-link>
        </div>
      </form>
    </CardContent>
  </Card>
</template>
