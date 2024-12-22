<script setup lang="ts">
import PasswordToggleButton from "@/components/PasswordVisibility.vue"
import { Button } from "@/components/ui/button"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { randImage } from "@/lib/utils"
import { loginSchema } from "@/schemas/auth"
import { useAuthStore } from "@/stores/auth"
import { Loader2 } from "lucide-vue-next"
import { useForm } from "vee-validate"
import { ref } from "vue"
import { useRouter } from "vue-router"
import { toast } from "vue-sonner"

const bgImg = randImage()
const router = useRouter()
const authStore = useAuthStore()
const form = useForm({
  validationSchema: loginSchema,
})
const showPassword = ref(false)

const onSubmit = form.handleSubmit(async (values) => {
  try {
    await authStore.login(values.email, values.password)
    toast.message("¡Bienvenido!", { description: "Has iniciado sesión correctamente." })
    router.push("/")
  } catch (error) {
    toast.error("Credenciales inválidas")
  }
})
</script>

<template>
  <div class="grid min-h-svh w-full lg:grid-cols-2">
    <div class="max-h-svh overflow-y-auto">
      <div class="flex min-h-full items-center justify-center py-8">
        <div class="w-full max-w-[350px] px-4">
          <div class="grid gap-2 text-center">
            <h1 class="text-3xl font-bold">Iniciar Sesión</h1>
            <p class="text-balance text-muted-foreground">
              Ingresa tu email para acceder a tu cuenta
            </p>
          </div>

          <form @submit="onSubmit" class="mt-6 grid gap-4">
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
                <div class="flex items-center justify-between">
                  <FormLabel>Contraseña</FormLabel>
                  <router-link
                    to="/recover"
                    tabindex="-1"
                    class="text-sm text-muted-foreground underline-offset-4 hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </router-link>
                </div>
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
