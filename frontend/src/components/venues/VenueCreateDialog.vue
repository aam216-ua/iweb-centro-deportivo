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
import { Switch } from "@/components/ui/switch"
import { venueSchema } from "@/schemas/venue"
import { activitiesService } from "@/services/activity"
import { venuesService } from "@/services/venue"
import type { Activity } from "@/types/activity"
import { VenueStatus } from "@/types/venue"
import { Loader2 } from "lucide-vue-next"
import { useField, useForm } from "vee-validate"
import { onMounted, reactive, ref } from "vue"
import { toast } from "vue-sonner"

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  venueCreated: []
  "update:open": [value: boolean]
}>()

const loading = ref(false)
const activities = ref<Activity[]>([])

const form = useForm({
  validationSchema: venueSchema,
  initialValues: {
    status: VenueStatus.AVAILABLE,
  },
})

const statusField = reactive(
  useField<VenueStatus>("status", undefined, {
    form: form,
  }),
)

function toggleStatus(checked: boolean) {
  statusField.value = checked ? VenueStatus.AVAILABLE : VenueStatus.UNAVAILABLE
}

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
                <Input type="number" v-bind="componentField" />
              </FormControl>
              <FormMessage>{{ errorMessage }}</FormMessage>
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField, errorMessage }" name="fee">
            <FormItem>
              <FormLabel>Precio</FormLabel>
              <FormControl>
                <Input type="number" v-bind="componentField" step="0.01" />
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

        <FormItem>
          <div class="flex items-center justify-between">
            <div class="space-y-0.5">
              <FormLabel>Estado</FormLabel>
              <p class="text-sm text-muted-foreground">
                {{ statusField.value === VenueStatus.AVAILABLE ? "Disponible" : "No disponible" }}
              </p>
            </div>
            <Switch
              :name="statusField.name"
              :checked="statusField.value === VenueStatus.AVAILABLE"
              @update:checked="toggleStatus"
            />
          </div>
          <FormMessage>{{ statusField.errorMessage }}</FormMessage>
        </FormItem>

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
