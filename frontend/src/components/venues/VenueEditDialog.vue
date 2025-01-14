<script setup lang="ts">
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { venueSchema } from "@/schemas/venue"
import { activitiesService } from "@/services/activity"
import { venuesService } from "@/services/venue"
import type { Activity } from "@/types/activity"
import type { Venue } from "@/types/venue"
import { VenueStatus } from "@/types/venue"
import { Loader2 } from "lucide-vue-next"
import { useField, useForm } from "vee-validate"
import { onMounted, reactive, ref } from "vue"
import { toast } from "vue-sonner"

const props = defineProps<{
  open: boolean
  venue: Venue
}>()

const emit = defineEmits<{
  venueEdited: []
  "update:open": [value: boolean]
}>()

const loading = ref(false)
const activities = ref<Activity[]>([])

const form = useForm({
  validationSchema: venueSchema,
})

const nameField = reactive(
  useField<string>("name", undefined, {
    form: form,
    initialValue: props.venue.name,
  }),
)

const descriptionField = reactive(
  useField<string>("description", undefined, {
    form: form,
    initialValue: props.venue.description ?? "",
  }),
)

const capacityField = reactive(
  useField<number>("capacity", undefined, {
    form: form,
    initialValue: props.venue.capacity,
  }),
)

const feeField = reactive(
  useField<number>("fee", undefined, {
    form: form,
    initialValue: props.venue.fee,
  }),
)

const activityField = reactive(
  useField<string>("activityId", undefined, {
    form: form,
    initialValue: props.venue.activity?.id,
  }),
)

const statusField = reactive(
  useField<VenueStatus>("status", undefined, {
    form: form,
    initialValue: props.venue.status,
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
    await venuesService.update(props.venue.id, values)
    emit("update:open", false)
    emit("venueEdited")
    toast.success("Pista actualizada exitosamente")
  } catch (error) {
    toast.error("No se pudo actualizar la pista")
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Editar Pista</DialogTitle>
      </DialogHeader>
      <form @submit="onSubmit" class="mt-6 grid gap-4">
        <FormItem>
          <FormLabel>Nombre</FormLabel>
          <FormControl>
            <Input v-model="nameField.value" :name="nameField.name" @blur="nameField.handleBlur" />
          </FormControl>
          <FormMessage>{{ nameField.errorMessage }}</FormMessage>
        </FormItem>

        <FormItem>
          <FormLabel>Descripción</FormLabel>
          <FormControl>
            <Input
              v-model="descriptionField.value"
              :name="descriptionField.name"
              @blur="descriptionField.handleBlur"
            />
          </FormControl>
          <FormMessage>{{ descriptionField.errorMessage }}</FormMessage>
        </FormItem>

        <div class="grid grid-cols-2 gap-4">
          <FormItem>
            <FormLabel>Capacidad</FormLabel>
            <FormControl>
              <Input
                v-model="capacityField.value"
                :name="capacityField.name"
                @blur="capacityField.handleBlur"
                type="number"
                :min="1"
                :max="200"
              />
            </FormControl>
            <FormMessage>{{ capacityField.errorMessage }}</FormMessage>
          </FormItem>

          <FormItem>
            <FormLabel>Precio</FormLabel>
            <FormControl>
              <Input
                v-model="feeField.value"
                :name="feeField.name"
                @blur="feeField.handleBlur"
                type="number"
                step="0.01"
                :min="0.01"
                :max="9999.99"
              />
            </FormControl>
            <FormMessage>{{ feeField.errorMessage }}</FormMessage>
          </FormItem>
        </div>

        <FormItem>
          <FormLabel>Actividad</FormLabel>
          <Select
            v-model="activityField.value"
            :name="activityField.name"
            @blur="activityField.handleBlur"
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una actividad" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectGroup>
                <SelectItem v-for="activity in activities" :key="activity.id" :value="activity.id">
                  {{ activity.name }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <FormMessage>{{ activityField.errorMessage }}</FormMessage>
        </FormItem>

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
            {{ loading ? "Guardando..." : "Guardar cambios" }}
          </Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>
</template>
