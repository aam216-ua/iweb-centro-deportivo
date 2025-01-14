<script setup lang="ts">
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { bookingSchema } from "@/schemas/booking"
import { bookingsService } from "@/services/booking"
import { usersService } from "@/services/user"
import { venuesService } from "@/services/venue"
import { useAuthStore } from "@/stores/auth"
import type { Booking } from "@/types/booking"
import { BookingTurn } from "@/types/booking"
import type { User } from "@/types/user"
import type { Venue } from "@/types/venue"
import type { DateValue } from "@internationalized/date"
import { getLocalTimeZone, today } from "@internationalized/date"
import { CalendarIcon, Loader2 } from "lucide-vue-next"
import { toDate } from "radix-vue/date"
import { useForm } from "vee-validate"
import { computed, onMounted, ref } from "vue"
import { toast } from "vue-sonner"

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  "update:open": [value: boolean]
  refresh: []
}>()

const loading = ref(false)
const venues = ref<Venue[]>([])
const users = ref<User[]>([])
const bookings = ref<Booking[]>([])
const auth = useAuthStore()
const dateValue = ref<DateValue>()

const tomorrow = today(getLocalTimeZone()).add({ days: 1 })
const maxDate = tomorrow.add({ days: 14 })
const timeSlots = Object.values(BookingTurn)

const form = useForm({
  validationSchema: bookingSchema,
  initialValues: {
    appointerId: auth.user?.id,
    appointeeId: auth.user?.id,
    venueId: undefined,
    turn: undefined,
    date: undefined,
  },
})

const { handleSubmit, setFieldValue, values } = form

const selectedVenue = computed(() => {
  return venues.value.find((v) => v.id === values.venueId)
})

const getBookingsForDate = (date: Date) => {
  if (!date) return []
  return bookings.value.filter(
    (booking) => new Date(booking.date).toDateString() === date.toDateString(),
  )
}

const isSlotAvailable = computed(() => {
  if (!dateValue.value || !values.venueId || !values.turn) return true

  const date = new Date(toDate(dateValue.value))
  const dateBookings = getBookingsForDate(date)

  return !dateBookings.some(
    (booking) => booking.venue?.id === values.venueId && booking.turn === values.turn,
  )
})

const isFormComplete = computed(() => {
  return !!(values.venueId && dateValue.value && values.turn && values.appointeeId)
})

const canSubmit = computed(() => {
  return isFormComplete.value && isSlotAvailable.value && !loading.value
})

const formatDate = (date: DateValue) => {
  return new Intl.DateTimeFormat("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(toDate(date))
}

onMounted(async () => {
  try {
    const [venuesResponse, usersResponse, bookingsResponse] = await Promise.all([
      venuesService.getAll(),
      usersService.getAll(),
      bookingsService.getAll(),
    ])
    venues.value = venuesResponse.data
    users.value = usersResponse.data
    bookings.value = bookingsResponse.data
  } catch (error) {
    toast.error("Error al cargar los datos")
  }
})

const onSubmit = handleSubmit(async (values) => {
  if (!canSubmit.value) return

  try {
    loading.value = true
    if (!dateValue.value || !selectedVenue.value?.fee) {
      throw new Error("Datos inválidos")
    }

    const payload = {
      ...values,
      date: new Date(toDate(dateValue.value).setHours(12)).toISOString(),
      fee: selectedVenue.value.fee,
    }

    await bookingsService.create(payload)
    form.resetForm()
    dateValue.value = undefined
    emit("update:open", false)
    emit("refresh")
    toast.success("Reserva creada exitosamente")
  } catch (error) {
    toast.error("No se pudo crear la reserva")
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="sm:max-w-[700px]">
      <DialogHeader>
        <DialogTitle>Nueva Reserva</DialogTitle>
      </DialogHeader>
      <form @submit="onSubmit" class="mt-6">
        <div class="grid gap-6">
          <div class="grid gap-6 sm:grid-cols-2">
            <FormField v-slot="{ field }" name="venueId">
              <FormItem>
                <FormLabel>Pista</FormLabel>
                <Select v-bind="field">
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una pista" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem v-for="venue in venues" :key="venue.id" :value="venue.id">
                      {{ venue.name }} - {{ venue.activity?.name }}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ field }" name="appointeeId">
              <FormItem>
                <FormLabel>Cliente</FormLabel>
                <Select v-bind="field">
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un cliente" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem v-for="user in users" :key="user.id" :value="user.id">
                      {{ user.name }}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>

          <div class="grid gap-6 sm:grid-cols-2">
            <FormField name="date">
              <FormItem>
                <FormLabel>Fecha</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        class="w-full pl-3 text-left font-normal"
                        :class="!dateValue && 'text-muted-foreground'"
                      >
                        <span>{{
                          dateValue ? formatDate(dateValue) : "Selecciona una fecha"
                        }}</span>
                        <CalendarIcon class="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent class="w-auto p-0" align="start">
                    <Calendar
                      v-model="dateValue"
                      mode="single"
                      locale="es"
                      :min-value="tomorrow"
                      :max-value="maxDate"
                      @update:model-value="(date) => setFieldValue('date', date?.toString())"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ field }" name="turn">
              <FormItem>
                <FormLabel>Horario</FormLabel>
                <Select v-bind="field">
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un horario" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem v-for="turn in timeSlots" :key="turn" :value="turn">
                      {{ turn }}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
        </div>

        <div class="flex justify-end gap-4 mt-6">
          <Button type="button" variant="outline" @click="$emit('update:open', false)">
            Cancelar
          </Button>
          <Button type="submit" :disabled="!canSubmit">
            <template v-if="loading">
              <Loader2 class="mr-2 h-4 w-4 animate-spin" />
              Creando reserva...
            </template>
            <template v-else-if="!isFormComplete"> Complete todos los campos </template>
            <template v-else-if="!isSlotAvailable"> Horario no disponible </template>
            <template v-else> Crear reserva </template>
          </Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>
</template>
