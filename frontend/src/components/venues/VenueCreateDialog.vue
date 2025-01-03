<script setup lang="ts">
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { activitiesService } from "@/services/activity"
import { venuesService } from "@/services/venue"
import type { Activity } from "@/types/activity"
import { toTypedSchema } from "@vee-validate/zod"
import { Loader2 } from "lucide-vue-next"
import { useForm } from "vee-validate"
import { onMounted, ref } from "vue"
import { toast } from "vue-sonner"
import { z } from "zod"

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  venueCreated: []
  "update:open": [value: boolean]
}>()

const loading = ref(false)
const activities = ref<Activity[]>([])

const venueSchema = toTypedSchema(
  z.object({
    name: z.string().min(1, "El nombre es requerido"),
    description: z.string().optional(),
    capacity: z.number().min(1, "La capacidad debe ser mayor a 0"),
    fee: z.number().min(0.01, "El precio debe ser mayor a 0"),
    activityId: z.string().uuid("Actividad inválida"),
  }),
)

const form = useForm({
  validationSchema: venueSchema,
})

onMounted(async () => {
  try {
    activities.value = await activitiesService.getAll()
  } catch (error) {
    toast.error("Error al cargar actividades")
  }
})

const onSubmit = form.handleSubmit(async (values) => {
  try {
    loading.value = true
    await venuesService.create(values)
    form.resetForm()
    emit("update:open", false)
    emit("venueCreated")
    toast.success("Pista creada exitosamente")
  } catch (error) {
    toast.error("No se pudo crear la pista")
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Crear Pista</DialogTitle>
      </DialogHeader>
      <form @submit="onSubmit" class="mt-6 grid gap-4">
        <FormField v-slot="{ componentField, errorMessage }" name="name">
          <FormItem>
            <FormLabel>Nombre</FormLabel>
            <FormControl>
              <Input v-bind="componentField" />
            </FormControl>
            <FormMessage>{{ errorMessage }}</FormMessage>
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField, errorMessage }" name="description">
          <FormItem>
            <FormLabel>Descripción</FormLabel>
            <FormControl>
              <Input v-bind="componentField" />
            </FormControl>
            <FormMessage>{{ errorMessage }}</FormMessage>
          </FormItem>
        </FormField>

        <div class="grid grid-cols-2 gap-4">
          <FormField v-slot="{ componentField, errorMessage }" name="capacity">
            <FormItem>
              <FormLabel>Capacidad</FormLabel>
              <FormControl>
                <Input type="number" v-bind="componentField" :min="1" :max="200" />
              </FormControl>
              <FormMessage>{{ errorMessage }}</FormMessage>
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField, errorMessage }" name="fee">
            <FormItem>
              <FormLabel>Precio</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  v-bind="componentField"
                  step="0.01"
                  :min="0.01"
                  :max="9999.99"
                />
              </FormControl>
              <FormMessage>{{ errorMessage }}</FormMessage>
            </FormItem>
          </FormField>
        </div>

        <FormField v-slot="{ field }" name="activityId">
          <FormItem>
            <FormLabel>Actividad</FormLabel>
            <Select v-bind="field">
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una actividad" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectGroup>
                  <SelectItem
                    v-for="activity in activities"
                    :key="activity.id"
                    :value="activity.id"
                  >
                    {{ activity.name }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        </FormField>

        <div class="flex justify-end gap-4 mt-4">
          <Button type="button" variant="outline" @click="$emit('update:open', false)">
            Cancelar
          </Button>
          <Button type="submit" :disabled="loading">
            <Loader2 v-if="loading" class="mr-2 h-4 w-4 animate-spin" />
            {{ loading ? "Creando pista..." : "Crear pista" }}
          </Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>
</template>
