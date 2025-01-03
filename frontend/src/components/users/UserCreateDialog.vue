<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Crear Usuario</DialogTitle>
      </DialogHeader>
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

        <div class="flex justify-end gap-4 mt-4">
          <Button type="button" variant="outline" @click="$emit('update:open', false)">
            Cancelar
          </Button>
          <Button type="submit" :disabled="loading">
            <Loader2 v-if="loading" class="mr-2 h-4 w-4 animate-spin" />
            {{ loading ? "Creando usuario..." : "Crear usuario" }}
          </Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import PasswordToggleButton from "@/components/PasswordVisibility.vue"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { registerSchema } from "@/schemas/auth"
import { useAuthStore } from "@/stores/auth"
import { Loader2 } from "lucide-vue-next"
import { useForm } from "vee-validate"
import { ref } from "vue"
import { toast } from "vue-sonner"

defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  userCreated: []
  "update:open": [value: boolean]
}>()

const authStore = useAuthStore()
const loading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const form = useForm({
  validationSchema: registerSchema,
})

const onSubmit = form.handleSubmit(async (values) => {
  try {
    loading.value = true
    await authStore.register(values)
    form.resetForm()
    emit("update:open", false)
    emit("userCreated")
    toast.success("Usuario creado exitosamente")
  } catch (error) {
    toast.error("No se pudo crear el usuario")
  } finally {
    loading.value = false
  }
})
</script>
