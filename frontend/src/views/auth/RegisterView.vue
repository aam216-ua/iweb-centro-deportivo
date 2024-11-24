<script setup lang="ts">
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
import { registerSchema } from "@/schemas/auth.schema"
import { authService } from "@/services/auth.service"
import { vAutoAnimate } from "@formkit/auto-animate/vue"
import { Loader2 } from "lucide-vue-next"
import { useForm } from "vee-validate"
import { ref } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()
const loading = ref(false)

const form = useForm({
  validationSchema: registerSchema,
})

const onSubmit = form.handleSubmit(async (values) => {
  try {
    loading.value = true
    await authService.register(values)
    toast({
      title: "¡Cuenta creada!",
      description: "Tu cuenta ha sido creada exitosamente.",
    })
    router.push("/login")
  } catch (error) {
    toast({
      title: "Error",
      description: "No se pudo crear la cuenta. Intenta nuevamente.",
      variant: "destructive",
    })
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
            <FormItem v-auto-animate>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input v-bind="componentField" />
              </FormControl>
              <FormMessage>{{ errorMessage }}</FormMessage>
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField, errorMessage }" name="apellidos">
            <FormItem v-auto-animate>
              <FormLabel>Apellidos</FormLabel>
              <FormControl>
                <Input v-bind="componentField" />
              </FormControl>
              <FormMessage>{{ errorMessage }}</FormMessage>
            </FormItem>
          </FormField>
        </div>

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
            <FormLabel>Contraseña</FormLabel>
            <FormControl>
              <Input type="password" v-bind="componentField" />
            </FormControl>
            <FormMessage>{{ errorMessage }}</FormMessage>
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField, errorMessage }" name="confirmPassword">
          <FormItem v-auto-animate>
            <FormLabel>Confirmar Contraseña</FormLabel>
            <FormControl>
              <Input type="password" v-bind="componentField" />
            </FormControl>
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
    </CardContent>
  </Card>
</template>
