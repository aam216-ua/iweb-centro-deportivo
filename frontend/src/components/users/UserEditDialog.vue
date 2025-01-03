<script setup lang="ts">
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { settingsSchema } from "@/schemas/settings"
import { useAuthStore } from "@/stores/auth"
import type { User } from "@/types/user"
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

const loading = ref(false)
const authStore = useAuthStore()

const form = useForm({
  validationSchema: settingsSchema,
})

const nameField = reactive(
  useField<string>("name", undefined, {
    form: form,
    initialValue: props.user.name,
  }),
)

const surnameField = reactive(
  useField<string>("surname", undefined, {
    form: form,
    initialValue: props.user.surname,
  }),
)

const phoneField = reactive(
  useField<string>("phone", undefined, {
    form: form,
    initialValue: props.user.phone.replace("+34", "").trim(),
  }),
)

const emailField = reactive(
  useField<string>("email", undefined, {
    form: form,
    initialValue: props.user.email,
  }),
)

const onSubmit = form.handleSubmit(async (values) => {
  console.log(props)
  try {
    loading.value = true
    await authStore.updateProfile(values, props.user.id)
    emit("update:open", false)
    emit("userEdited")
    toast.success("Usuario actualizado exitosamente")
  } catch (error) {
    toast.error("No se pudo actualizar el usuario")
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Editar Usuario</DialogTitle>
      </DialogHeader>
      <form @submit="onSubmit" class="mt-6 grid gap-4">
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

        <div class="flex justify-end gap-4 mt-4">
          <Button type="button" variant="outline" @click="$emit('update:open', false)">
            Cancelar
          </Button>
          <Button type="submit" :disabled="loading">
            <Loader2 v-if="loading" class="mr-2 h-4 w-4 animate-spin" />
            {{ loading ? "Guardando..." : "Guardar cambios" }}
          </Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>
</template>
