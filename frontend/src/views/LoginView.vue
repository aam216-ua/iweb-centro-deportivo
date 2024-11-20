<script setup lang="ts">
import { useRouter } from "vue-router"
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
import { loginSchema } from "@/schemas/auth.schema"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/toast"
import { vAutoAnimate } from "@formkit/auto-animate/vue"
import { useForm } from "vee-validate"
import { h } from "vue"
import * as z from "zod"
import { useAuthStore } from "@/stores/auth.store"

const router = useRouter()
const authStore = useAuthStore()

const form = useForm({
  validationSchema: loginSchema,
})

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
              <Input type="email" placeholder="tu@ejemplo.com" v-bind="componentField" />
            </FormControl>
            <FormDescription> Ingresa el email con el que te registraste </FormDescription>
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
            <FormControl>
              <Input type="password" placeholder="Tu contraseña" v-bind="componentField" />
            </FormControl>
            <FormMessage>{{ errorMessage }}</FormMessage>
          </FormItem>
        </FormField>

        <Button type="submit" class="w-full" :disabled="authStore.loading">
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
