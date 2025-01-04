<script setup lang="ts">
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Stepper,
  StepperDescription,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@/components/ui/stepper"
import { bookingSchema } from "@/schemas/booking"
import { bookingsService } from "@/services/booking"
import { venuesService } from "@/services/venue"
import { useAuthStore } from "@/stores/auth"
import { BookingTurn } from "@/types/booking"
import type { Venue } from "@/types/venue"
import type { DateValue } from "@internationalized/date"
import { getLocalTimeZone, parseDate, today } from "@internationalized/date"
import { CalendarDays, ChevronRight, Clock, DollarSign, MapPin, Users } from "lucide-vue-next"
import { useForm } from "vee-validate"
import { computed, onMounted, ref } from "vue"
import { useRouter } from "vue-router"
import { toast } from "vue-sonner"

const router = useRouter()
const auth = useAuthStore()
const venues = ref<Venue[]>([])
const selectedVenue = ref<Venue | null>(null)
const loading = ref(false)
const selectedTimeSlot = ref<string | null>(null)
const step = ref(1)

const { handleSubmit, setFieldValue, values } = useForm({
  validationSchema: bookingSchema,
  initialValues: {
    appointerId: auth.user?.id,
    appointeeId: auth.user?.id,
  },
})

const tomorrow = today(getLocalTimeZone()).add({ days: 1 })
const maxDate = tomorrow.add({ days: 14 })

const selectedDate = computed({
  get: () => (values.date ? parseDate(values.date) : undefined),
  set: (val) => val,
})

const timeSlots = Object.values(BookingTurn)

const steps = [
  {
    step: 1,
    title: "Selecciona pista",
    description: "Elige la pista deportiva",
    icon: MapPin,
  },
  {
    step: 2,
    title: "Elige horario",
    description: "Selecciona la hora",
    icon: Clock,
  },
  {
    step: 3,
    title: "Fecha",
    description: "Escoge el día",
    icon: CalendarDays,
  },
]

onMounted(async () => {
  try {
    const response = await venuesService.getAll()
    venues.value = response.data
  } catch {
    toast.error("Error al cargar las pistas")
  }
})

const selectVenue = (venue: Venue) => {
  selectedVenue.value = venue
  setFieldValue("venueId", venue.id)
}

const selectTimeSlot = (time: BookingTurn) => {
  selectedTimeSlot.value = time
  setFieldValue("turn", time)
}

const selectDate = (date: DateValue | undefined) => {
  if (date) {
    setFieldValue("date", date.toString())
  } else {
    setFieldValue("date", undefined)
  }
}

function convertToISOString(dateString: string): string {
  const date = new Date(dateString)
  date.setUTCHours(0, 0, 0, 0)
  return date.toISOString()
}

const onSubmit = handleSubmit(async (values) => {
  try {
    loading.value = true
    const formattedDate = convertToISOString(values.date)
    const payload = { ...values, date: formattedDate }
    await bookingsService.create(payload)
    toast.success("Reserva creada exitosamente")
    router.push("/")
  } catch {
    toast.error("Error al crear la reserva")
  } finally {
    loading.value = false
  }
})

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)
}

const canBook = computed(() => {
  return selectedVenue.value && values.date && selectedTimeSlot.value
})
</script>

<template>
  <div class="container py-8 px-8">
    <div class="max-w-6xl mx-auto">
      <div class="mb-8">
        <h1 class="text-2xl sm:text-3xl font-bold">Nueva Reserva</h1>
      </div>

      <div class="grid gap-8 lg:grid-cols-[1fr_400px]">
        <div class="space-y-8">
          <div class="mb-8">
            <Stepper v-model="step" class="block w-full">
              <div class="flex w-full flex-start gap-2">
                <StepperItem
                  v-for="s in steps"
                  :key="s.step"
                  v-slot="{ state }"
                  class="relative flex w-full flex-col items-center justify-center"
                  :step="s.step"
                >
                  <StepperSeparator
                    v-if="s.step !== steps[steps.length - 1].step"
                    class="absolute left-[calc(50%+20px)] right-[calc(-50%+10px)] top-5 block h-0.5 shrink-0 rounded-full bg-muted group-data-[state=completed]:bg-primary"
                  />

                  <StepperTrigger as-child>
                    <Button
                      :variant="state === 'completed' || state === 'active' ? 'default' : 'outline'"
                      size="icon"
                      class="z-10 rounded-full shrink-0"
                      :class="[
                        state === 'active' &&
                          'ring-2 ring-ring ring-offset-2 ring-offset-background',
                      ]"
                    >
                      <component :is="s.icon" class="h-4 w-4" />
                    </Button>
                  </StepperTrigger>

                  <div class="mt-5 flex flex-col items-center text-center">
                    <StepperTitle
                      :class="[state === 'active' && 'text-primary']"
                      class="text-sm font-semibold transition lg:text-base"
                    >
                      {{ s.title }}
                    </StepperTitle>
                    <StepperDescription
                      :step="s.step"
                      :class="[state === 'active' && 'text-primary']"
                      class="sr-only text-xs text-muted-foreground transition md:not-sr-only lg:text-sm"
                    >
                      {{ s.description }}
                    </StepperDescription>
                  </div>
                </StepperItem>
              </div>
            </Stepper>
          </div>

          <div class="space-y-4">
            <div v-show="step === 1">
              <div class="grid gap-3">
                <Card
                  v-for="venue in venues"
                  :key="venue.id"
                  :class="[
                    'cursor-pointer transition-colors hover:bg-muted',
                    selectedVenue?.id === venue.id ? 'ring-2 ring-primary' : '',
                  ]"
                  @click="selectVenue(venue)"
                >
                  <CardContent class="p-4">
                    <div class="flex justify-between items-start">
                      <div>
                        <h3 class="font-medium">{{ venue.name }}</h3>
                        <p class="text-sm text-muted-foreground">{{ venue.activity?.name }}</p>
                      </div>
                      <div class="text-right">
                        <div class="flex items-center gap-1 text-sm">
                          <Users class="w-4 h-4" />
                          {{ venue.capacity }}
                        </div>
                        <div class="flex items-center gap-1 text-sm font-medium">
                          <DollarSign class="w-4 h-4" />
                          {{ venue.fee }}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div v-show="step === 2">
              <div class="grid gap-3 sm:grid-cols-2">
                <button
                  v-for="time in timeSlots"
                  :key="time"
                  :class="[
                    'p-4 rounded-lg border text-left transition-colors hover:bg-muted',
                    selectedTimeSlot === time ? 'ring-2 ring-primary' : '',
                  ]"
                  @click="selectTimeSlot(time)"
                >
                  <div class="flex items-center justify-center text-lg font-medium">
                    {{ time }}
                  </div>
                </button>
              </div>
            </div>

            <div v-show="step === 3">
              <div class="flex justify-center">
                <Calendar
                  v-model="selectedDate"
                  class="border rounded-md w-fit"
                  locale="es"
                  :min-value="tomorrow"
                  :max-value="maxDate"
                  mode="single"
                  @update:model-value="selectDate"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="lg:sticky lg:top-4">
          <Card>
            <CardHeader>
              <CardTitle class="text-lg">Resumen de la Reserva</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="space-y-3">
                <div class="flex justify-between items-center">
                  <span class="text-muted-foreground">Pista</span>
                  <span class="font-medium">
                    {{ selectedVenue?.name || "No seleccionada" }}
                  </span>
                </div>
                <Separator />
                <div class="flex justify-between items-center">
                  <span class="text-muted-foreground">Fecha</span>
                  <span class="font-medium">
                    {{ values.date ? formatDate(new Date(values.date)) : "No seleccionada" }}
                  </span>
                </div>
                <Separator />
                <div class="flex justify-between items-center">
                  <span class="text-muted-foreground">Horario</span>
                  <span class="font-medium">
                    {{ selectedTimeSlot || "No seleccionado" }}
                  </span>
                </div>
                <Separator />
                <div class="flex justify-between items-center">
                  <span class="font-medium">Total</span>
                  <span class="font-medium">
                    {{ selectedVenue ? `$${selectedVenue.fee}` : "—" }}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button class="w-full" size="lg" :disabled="!canBook || loading" @click="onSubmit">
                {{ loading ? "Creando reserva..." : "Confirmar Reserva" }}
                <ChevronRight class="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>
