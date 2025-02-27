<script setup lang="ts">
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import {
  Stepper,
  StepperDescription,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@/components/ui/stepper"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { usePermissions } from "@/lib/permissions"
import { createUserSchema } from "@/schemas/auth"
import { activitiesService } from "@/services/activity"
import { bookingsService } from "@/services/booking"
import { usersService } from "@/services/user"
import { venuesService } from "@/services/venue"
import { useAuthStore } from "@/stores/auth"
import type { Activity } from "@/types/activity"
import type { Booking } from "@/types/booking"
import { BookingTurn } from "@/types/booking"
import type { User as UserType } from "@/types/user"
import type { Venue } from "@/types/venue"
import type { DateValue } from "@internationalized/date"
import { getLocalTimeZone, today } from "@internationalized/date"
import {
  Ban,
  CalendarDays,
  CalendarIcon,
  Check,
  ChevronRight,
  ChevronsUpDown,
  Clock,
  DollarSign,
  Loader2,
  MapPin,
  Plus,
  User,
} from "lucide-vue-next"
import { useForm } from "vee-validate"
import { computed, onMounted, ref, watch } from "vue"
import { toast } from "vue-sonner"

const auth = useAuthStore()
const venues = ref<Venue[]>([])
const bookings = ref<Booking[]>([])
const myBookings = ref<Booking[]>([])
const activities = ref<Activity[]>([])
const activeTab = ref("list")
const step = ref(1)
const deleteLoading = ref(false)
const { isStaff } = usePermissions()
const users = ref<UserType[]>([])
const selectedUser = ref<UserType | null>(null)
const showCreateUserDialog = ref(false)
const userSearch = ref("")
const createUserLoading = ref(false)
const showUserSelect = ref(false)

const createUserForm = useForm({
  validationSchema: createUserSchema,
})

const baseSteps = [
  {
    title: "Actividad",
    description: "Elige la actividad",
    icon: MapPin,
  },
  {
    title: "Fecha y Hora",
    description: "Escoge día y hora",
    icon: Clock,
  },
  {
    title: "Pista",
    description: "Selecciona pista",
    icon: MapPin,
  },
]

const steps = computed(() => {
  const finalSteps = []

  if (isStaff.value) {
    finalSteps.push({
      step: 1,
      title: "Cliente",
      description: "Seleccionar cliente",
      icon: User,
    })
  }

  baseSteps.forEach((step, index) => {
    finalSteps.push({
      ...step,
      step: isStaff.value ? index + 2 : index + 1,
    })
  })

  return finalSteps
})

const selectedActivity = ref<string | null>(null)
const selectedDate = ref<DateValue | undefined>(undefined)
const selectedTime = ref<BookingTurn | null>(null)
const selectedVenue = ref<Venue | null>(null)
const loading = ref(false)

const timeSlots = Object.values(BookingTurn)

const tomorrow = today(getLocalTimeZone()).add({ days: 1 })
const maxDate = tomorrow.add({ days: 14 })

const filteredUsers = computed(() => {
  const search = userSearch.value?.toLowerCase().trim() || ""
  if (!search) return users.value

  return users.value.filter((user) => {
    const searchableFields = [
      user.name?.toLowerCase() || "",
      user.surname?.toLowerCase() || "",
      user.email?.toLowerCase() || "",
      user.phone?.toLowerCase() || "",
    ]
    return searchableFields.some((field) => field.includes(search))
  })
})

const handleCreateUser = createUserForm.handleSubmit(async (values) => {
  try {
    createUserLoading.value = true
    const response = await auth.createUserNoPassword(values)
    const createdUser = response
    selectedUser.value = createdUser
    users.value = [...users.value, createdUser]
    showCreateUserDialog.value = false
    showUserSelect.value = false
    createUserForm.resetForm()
    toast.success("Usuario creado exitosamente")
  } catch (error) {
    toast.error("Error al crear el usuario")
  } finally {
    createUserLoading.value = false
  }
})

const resetForm = () => {
  selectedUser.value = null
  selectedActivity.value = null
  selectedDate.value = undefined
  selectedTime.value = null
  selectedVenue.value = null
  step.value = 1
}

const refreshBookings = async () => {
  const bookingsResponse = await bookingsService.getAll()
  bookings.value = bookingsResponse.data
  myBookings.value = bookingsResponse.data.filter(
    (booking) => booking.appointee.id === auth.user?.id,
  )
}

const handleDelete = async (bookingId: string) => {
  try {
    deleteLoading.value = true
    await bookingsService.delete(bookingId)
    await refreshBookings()
    toast.success("Reserva cancelada exitosamente")
  } catch (error) {
    toast.error("Error al cancelar la reserva")
  } finally {
    deleteLoading.value = false
  }
}

const canCancelBooking = (date: string) => {
  return new Date(date) > new Date()
}

const formatTime = (date: string) => {
  return new Intl.DateTimeFormat("es-ES", {
    hour: "numeric",
    minute: "numeric",
  }).format(new Date(date))
}

watch(step, (newStep, oldStep) => {
  if (newStep < oldStep) {
    if ((!isStaff.value && newStep === 1) || (isStaff.value && newStep === 2)) {
      selectedActivity.value = null
      selectedDate.value = undefined
      selectedTime.value = null
      selectedVenue.value = null
    } else if ((!isStaff.value && newStep === 2) || (isStaff.value && newStep === 3)) {
      selectedDate.value = undefined
      selectedTime.value = null
      selectedVenue.value = null
    }
  }
})

const venuesByActivity = computed(() => {
  if (!selectedActivity.value) return []
  return venues.value.filter((venue) => venue.activity?.name === selectedActivity.value)
})

const getBookingsForDate = (date: Date) => {
  return bookings.value.filter(
    (booking) =>
      new Date(booking.date).toDateString() === date.toDateString() &&
      venuesByActivity.value.some((venue) => venue.id === booking.venue?.id),
  )
}

const getUnavailableTurns = (date: Date) => {
  const dateBookings = getBookingsForDate(date)
  const unavailableTurns = new Set<BookingTurn>()
  const availableVenues = venuesByActivity.value

  if (!availableVenues || availableVenues.length === 0) {
    Object.values(BookingTurn).forEach((turn) => unavailableTurns.add(turn))
    return unavailableTurns
  }

  Object.values(BookingTurn).forEach((turn) => {
    const bookingsForTurn = dateBookings.filter((booking) => booking.turn === turn)
    const bookedVenueIds = new Set(bookingsForTurn.map((booking) => booking.venue?.id))

    if (availableVenues.every((venue) => bookedVenueIds.has(venue.id))) {
      unavailableTurns.add(turn)
    }
  })

  return unavailableTurns
}

const availableVenues = computed(() => {
  if (!selectedActivity.value || !selectedDate.value || !selectedTime.value) {
    return []
  }

  return venuesByActivity.value.filter((venue) => {
    return !bookings.value.some(
      (booking) =>
        booking.venue?.id === venue.id &&
        selectedDate.value &&
        new Date(booking.date).toDateString() ===
          new Date(selectedDate.value.toString()).toDateString() &&
        booking.turn === selectedTime.value,
    )
  })
})

const isDateDisabled = (date: Date) => {
  if (!selectedActivity.value) return true

  const unavailableTurns = getUnavailableTurns(date)
  return unavailableTurns.size === Object.keys(BookingTurn).length
}

const isTimeSlotDisabled = (time: BookingTurn) => {
  if (!selectedActivity.value || !selectedDate.value) return true

  const unavailableTurns = getUnavailableTurns(new Date(selectedDate.value.toString()))
  return unavailableTurns.has(time)
}

const handleSubmit = async () => {
  if (!canProceed.value || !selectedTime.value || !auth.user) return
  if (!isStaff.value && selectedVenue.value.fee > auth.user?.balance) {
    toast.error("Saldo insuficiente")
    return
  }
  const appointeeId = isStaff.value ? selectedUser.value?.id : auth.user.id

  if (!appointeeId) return

  try {
    loading.value = true
    const payload = {
      venueId: selectedVenue.value!.id,
      date: new Date(selectedDate.value!.toString()).toISOString(),
      turn: selectedTime.value,
      appointerId: auth.user.id,
      appointeeId: appointeeId,
      fee: selectedVenue.value!.fee,
    }

    await bookingsService.create(payload)
    await refreshBookings()
    resetForm()
    toast.success("Reserva creada exitosamente")
    activeTab.value = "list"
  } catch (error) {
    toast.error("Error al crear la reserva")
  } finally {
    loading.value = false
  }
}

const canProceed = computed(() => {
  const currentStepIndex = step.value - 1
  const currentStep = steps.value[currentStepIndex]

  if (!currentStep) return false

  const conditions = isStaff.value
    ? [
        !!selectedUser.value,
        !!selectedActivity.value,
        !!selectedDate.value && !!selectedTime.value,
        !!selectedVenue.value && !loading.value,
      ]
    : [
        !!selectedActivity.value,
        !!selectedDate.value && !!selectedTime.value,
        !!selectedVenue.value && !loading.value,
      ]

  return conditions[currentStepIndex] || false
})

const getStepState = computed(() => (stepNumber: number) => {
  const currentStep = step.value
  const maxSteps = steps.value.length

  if (stepNumber === currentStep) return "active"
  if (stepNumber < currentStep) return "completed"

  if (stepNumber === currentStep + 1) {
    if (currentStep === 1 && selectedActivity.value) return "enabled"
    if (currentStep === 2 && selectedDate.value && selectedTime.value) return "enabled"
  }

  return "disabled"
})

const formatDate = (date: DateValue | string) => {
  return new Intl.DateTimeFormat("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date.toString()))
}

const getActivityIcon = () => {
  return MapPin
}

onMounted(async () => {
  try {
    const [venuesResponse, bookingsResponse, activitiesResponse, usersResponse] = await Promise.all(
      [
        venuesService.getAll(),
        bookingsService.getAll(),
        activitiesService.getAll(),
        isStaff.value ? usersService.getAll() : Promise.resolve({ data: [] }),
      ],
    )
    venues.value = venuesResponse.data
    bookings.value = bookingsResponse.data
    myBookings.value = bookingsResponse.data.filter(
      (booking) => booking.appointee.id === auth.user?.id,
    )
    activities.value = activitiesResponse
    users.value = usersResponse.data
  } catch (error) {
    toast.error("Error al cargar los datos")
  }
})
</script>

<template>
  <div class="container py-8 px-8">
    <div class="max-w-6xl mx-auto">
      <div class="mb-8">
        <h1 class="text-2xl sm:text-3xl font-bold">Reservas</h1>
      </div>

      <Tabs v-model="activeTab" class="w-full">
        <TabsList class="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="list">Mis Reservas</TabsTrigger>
          <TabsTrigger value="create">Hacer Reserva</TabsTrigger>
        </TabsList>

        <TabsContent value="list" class="space-y-8">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 class="text-2xl font-bold tracking-tight">Mis Reservas</h2>
              <p class="text-sm text-muted-foreground">
                Gestiona tus reservas deportivas y mantén un registro de tus actividades
              </p>
            </div>
            <Button
              variant="default"
              size="sm"
              class="flex items-center gap-2"
              @click="activeTab = 'create'"
            >
              <Plus class="w-4 h-4" />
              Nueva Reserva
            </Button>
          </div>

          <div v-if="myBookings.length > 0" class="grid gap-4">
            <Card
              v-for="booking in myBookings"
              :key="booking.id"
              class="group overflow-hidden transition-all hover:shadow-md"
            >
              <CardContent class="p-0">
                <div
                  :class="[
                    'relative p-6',
                    new Date(booking.date) > new Date()
                      ? 'bg-gradient-to-r from-primary/5 to-transparent'
                      : '',
                  ]"
                >
                  <div class="absolute top-0 right-0 p-4">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          class="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground"
                          :disabled="!canCancelBooking(booking.date)"
                        >
                          <Ban class="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Cancelar reserva?</AlertDialogTitle>
                          <AlertDialogDescription>
                            ¿Estás seguro de que quieres cancelar la reserva para
                            {{ booking.venue?.name }}? Esta acción no se puede deshacer.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            class="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            :disabled="deleteLoading"
                            @click="handleDelete(booking.id)"
                          >
                            <Loader2 v-if="deleteLoading" class="mr-2 h-4 w-4 animate-spin" />
                            {{ deleteLoading ? "Cancelando..." : "Sí, cancelar reserva" }}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>

                  <div class="grid gap-6">
                    <div class="flex items-start gap-4">
                      <div
                        class="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center"
                      >
                        <component :is="getActivityIcon()" class="w-6 h-6 text-primary" />
                      </div>
                      <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-2 mb-1">
                          <span
                            class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium"
                            :class="[
                              new Date(booking.date) > new Date()
                                ? 'bg-primary/10 text-primary'
                                : 'bg-muted text-muted-foreground',
                            ]"
                          >
                            {{ new Date(booking.date) > new Date() ? "Próxima" : "Completada" }}
                          </span>
                          <span class="text-xs text-muted-foreground">
                            #{{ booking.id.slice(-4).toUpperCase() }}
                          </span>
                        </div>
                        <h3 class="text-lg font-semibold truncate">{{ booking.venue?.name }}</h3>
                      </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div class="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <div
                          class="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0"
                        >
                          <Clock class="w-4 h-4 text-primary" />
                        </div>
                        <div class="min-w-0">
                          <p class="text-sm font-medium truncate">{{ booking.turn }}</p>
                          <p class="text-xs text-muted-foreground">Horario</p>
                        </div>
                      </div>

                      <div class="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <div
                          class="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0"
                        >
                          <CalendarDays class="w-4 h-4 text-primary" />
                        </div>
                        <div class="min-w-0">
                          <p class="text-sm font-medium truncate">{{ formatDate(booking.date) }}</p>
                          <p class="text-xs text-muted-foreground">Fecha</p>
                        </div>
                      </div>

                      <div class="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <div
                          class="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0"
                        >
                          <DollarSign class="w-4 h-4 text-primary" />
                        </div>
                        <div class="min-w-0">
                          <p class="text-sm font-medium truncate">{{ booking.fee }}€</p>
                          <p class="text-xs text-muted-foreground">Precio</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div v-else class="flex flex-col items-center justify-center py-16 px-4">
            <div class="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <CalendarIcon class="w-8 h-8 text-primary" />
            </div>
            <h3 class="text-lg font-semibold text-center mb-1">No tienes reservas aún</h3>
            <p class="text-sm text-muted-foreground text-center mb-6 max-w-sm">
              Empieza reservando una pista deportiva para tus actividades
            </p>
            <Button @click="activeTab = 'create'">
              <Plus class="w-4 h-4 mr-2" />
              Crear Primera Reserva
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="create">
          <div class="grid gap-8 lg:grid-cols-[1fr_400px]">
            <div class="space-y-8">
              <div class="mb-8">
                <Stepper v-model="step" :linear="false" class="block w-full">
                  <div class="flex w-full flex-start gap-2">
                    <StepperItem
                      v-for="s in steps"
                      :key="s.step"
                      class="relative flex w-full flex-col items-center justify-center"
                      :step="s.step"
                    >
                      <StepperSeparator
                        v-if="s.step !== steps[steps.length - 1].step"
                        class="absolute left-[calc(50%+20px)] right-[calc(-50%+10px)] top-5 block h-0.5 shrink-0 rounded-full bg-muted group-data-[state=completed]:bg-primary"
                      />

                      <StepperTrigger as-child>
                        <Button
                          :variant="
                            ['completed', 'active'].includes(getStepState(s.step))
                              ? 'default'
                              : 'outline'
                          "
                          size="icon"
                          class="z-10 rounded-full shrink-0"
                          :class="[
                            getStepState(s.step) === 'active' &&
                              'ring-2 ring-ring ring-offset-2 ring-offset-background',
                            getStepState(s.step) === 'disabled' && 'opacity-50 pointer-events-none',
                          ]"
                          @click="step = s.step"
                        >
                          <component :is="s.icon" class="h-4 w-4" />
                        </Button>
                      </StepperTrigger>

                      <div class="mt-5 flex flex-col items-center text-center">
                        <StepperTitle
                          :class="[
                            getStepState(s.step) === 'active' && 'text-primary',
                            getStepState(s.step) === 'disabled' && 'text-muted-foreground',
                          ]"
                          class="text-sm font-semibold transition lg:text-base"
                        >
                          {{ s.title }}
                        </StepperTitle>
                        <StepperDescription
                          :step="s.step"
                          :class="[
                            getStepState(s.step) === 'active' && 'text-primary',
                            getStepState(s.step) === 'disabled' && 'text-muted-foreground',
                          ]"
                          class="sr-only text-xs text-muted-foreground transition md:not-sr-only lg:text-sm"
                        >
                          {{ s.description }}
                        </StepperDescription>
                      </div>
                    </StepperItem>
                  </div>
                </Stepper>
              </div>

              <div class="space-y-8">
                <div v-show="step === 1 && isStaff">
                  <Card class="p-6">
                    <CardHeader class="px-0 pt-0">
                      <CardTitle class="text-lg font-semibold flex items-center gap-2">
                        <User class="w-5 h-5" />
                        Seleccionar Cliente
                      </CardTitle>
                    </CardHeader>
                    <CardContent class="px-0 pb-0">
                      <div class="space-y-4">
                        <Popover v-model:open="showUserSelect">
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              :aria-expanded="showUserSelect"
                              class="w-full justify-between"
                            >
                              {{ selectedUser?.name || "Seleccionar cliente..." }}
                              <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent class="w-[300px] p-0">
                            <Command>
                              <Input
                                placeholder="Buscar cliente..."
                                class="h-9"
                                :model-value="userSearch"
                                @input="
                                  (e: Event) => (userSearch = (e.target as HTMLInputElement).value)
                                "
                              />
                              <CommandList class="max-h-[200px] overflow-y-auto">
                                <CommandEmpty> No se encontraron resultados. </CommandEmpty>
                                <CommandGroup>
                                  <CommandItem
                                    v-for="user in filteredUsers"
                                    :key="user.id"
                                    :value="user.id"
                                    @click="
                                      () => {
                                        selectedUser = user
                                        showUserSelect = false
                                        userSearch = ''
                                      }
                                    "
                                    class="flex items-center justify-between cursor-pointer"
                                  >
                                    <div class="flex items-center gap-2">
                                      <User class="h-4 w-4" />
                                      <div class="flex flex-col">
                                        <span class="font-medium">{{ user.name }}</span>
                                        <span class="text-xs text-muted-foreground">
                                          {{ user.email }}
                                        </span>
                                      </div>
                                    </div>
                                    <Check
                                      v-if="selectedUser?.id === user.id"
                                      class="h-4 w-4 shrink-0"
                                    />
                                  </CommandItem>
                                </CommandGroup>
                              </CommandList>
                              <Button
                                variant="ghost"
                                class="w-full flex items-center justify-center py-2 border-t"
                                @click="showCreateUserDialog = true"
                              >
                                <Plus class="mr-2 h-4 w-4" />
                                Crear Nuevo Cliente
                              </Button>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </CardContent>
                    <CardFooter class="px-0 pt-6">
                      <div class="flex justify-end w-full">
                        <Button :disabled="!selectedUser" @click="step = 2">
                          Siguiente
                          <ChevronRight class="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                </div>

                <div v-show="(step === 2 && isStaff) || (step === 1 && !isStaff)">
                  <Card class="p-6">
                    <CardHeader class="px-0 pt-0">
                      <CardTitle class="text-lg font-semibold flex items-center gap-2">
                        <MapPin class="w-5 h-5" />
                        Seleccionar Actividad
                      </CardTitle>
                    </CardHeader>
                    <CardContent class="px-0 pb-0">
                      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <Button
                          v-for="activity in activities"
                          :key="activity.id"
                          :variant="selectedActivity === activity.name ? 'default' : 'outline'"
                          class="h-24 flex flex-col gap-2"
                          @click="selectedActivity = activity.name"
                        >
                          <span class="text-lg">{{ activity.name }}</span>
                        </Button>
                      </div>
                    </CardContent>
                    <CardFooter class="px-0 pt-6">
                      <div class="flex justify-between w-full">
                        <Button v-if="isStaff" variant="outline" @click="step--"> Atrás </Button>
                        <Button :disabled="!selectedActivity" @click="step++" class="ml-auto">
                          Siguiente
                          <ChevronRight class="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                </div>

                <div v-show="(step === 3 && isStaff) || (step === 2 && !isStaff)">
                  <Card class="p-6">
                    <CardHeader class="px-0 pt-0">
                      <CardTitle class="text-lg font-semibold flex items-center gap-2">
                        <CalendarDays class="w-5 h-5" />
                        Fecha y Hora
                      </CardTitle>
                    </CardHeader>
                    <CardContent class="px-0 pb-0">
                      <div class="grid md:grid-cols-[auto_300px] gap-6">
                        <div class="w-full flex flex-col items-center gap-2">
                          <h3 class="font-medium text-sm self-start">Selecciona una fecha</h3>
                          <Calendar
                            v-model="selectedDate"
                            mode="single"
                            class="border rounded-md w-fit"
                            :min-value="tomorrow"
                            :max-value="maxDate"
                            :disabled-dates="isDateDisabled"
                          />
                        </div>

                        <div class="space-y-4">
                          <h3 class="font-medium text-sm">Horas disponibles</h3>
                          <div
                            class="space-y-2 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-rounded-md scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent"
                          >
                            <Button
                              v-for="time in timeSlots"
                              :key="time"
                              :variant="selectedTime === time ? 'default' : 'outline'"
                              class="w-full h-12 justify-start transition-all duration-200"
                              :class="[
                                (!selectedDate || isTimeSlotDisabled(time)) &&
                                  'opacity-50 pointer-events-none bg-muted',
                                'relative',
                              ]"
                              @click="selectedTime = time"
                            >
                              <Clock
                                class="w-4 h-4 mr-2"
                                :class="
                                  selectedTime === time ? 'text-primary-foreground' : 'text-primary'
                                "
                              />
                              {{ time }}
                              <span
                                v-if="!selectedDate || isTimeSlotDisabled(time)"
                                class="ml-auto text-sm text-muted-foreground"
                              >
                                {{ !selectedDate ? "Selecciona fecha" : "No disponible" }}
                              </span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter class="px-0 pt-6">
                      <div class="flex justify-between w-full">
                        <Button variant="outline" @click="step--">Atrás</Button>
                        <Button :disabled="!selectedDate || !selectedTime" @click="step++">
                          Siguiente
                          <ChevronRight class="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                </div>

                <div v-show="(step === 4 && isStaff) || (step === 3 && !isStaff)">
                  <Card class="p-6">
                    <CardHeader class="px-0 pt-0">
                      <CardTitle class="text-lg font-semibold">Pistas Disponibles</CardTitle>
                    </CardHeader>
                    <CardContent class="px-0 pb-0">
                      <div class="grid gap-4">
                        <Button
                          v-for="venue in availableVenues"
                          :key="venue.id"
                          :variant="selectedVenue?.id === venue.id ? 'default' : 'outline'"
                          class="flex justify-between items-center h-16 px-4"
                          @click="selectedVenue = venue"
                        >
                          <span>{{ venue.name }}</span>
                          <span class="text-sm">{{ venue.fee }}€</span>
                        </Button>
                        <div
                          v-if="availableVenues.length === 0"
                          class="text-center text-muted-foreground py-8"
                        >
                          No hay pistas disponibles para los criterios seleccionados
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter class="px-0 pt-6">
                      <div class="flex justify-between w-full">
                        <Button variant="outline" @click="step--">Atrás</Button>
                        <Button
                          :disabled="!selectedVenue"
                          @click="handleSubmit"
                          :class="loading && 'opacity-50 pointer-events-none'"
                        >
                          <Loader2 v-if="loading" class="mr-2 h-4 w-4 animate-spin" />
                          {{ loading ? "Creando reserva..." : "Confirmar Reserva" }}
                          <ChevronRight v-if="!loading" class="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </div>

            <div class="hidden lg:block lg:sticky lg:top-4">
              <Card>
                <CardHeader>
                  <CardTitle class="text-lg">Resumen de la Reserva</CardTitle>
                </CardHeader>
                <CardContent>
                  <div class="space-y-3">
                    <div v-if="isStaff" class="flex justify-between items-center">
                      <span class="text-muted-foreground">Cliente</span>
                      <span class="font-medium">
                        {{ selectedUser?.name || "No seleccionado" }}
                      </span>
                    </div>
                    <Separator v-if="isStaff" />
                    <div class="flex justify-between items-center">
                      <span class="text-muted-foreground">Actividad</span>
                      <span class="font-medium">
                        {{ selectedActivity || "No seleccionada" }}
                      </span>
                    </div>
                    <Separator />
                    <div class="flex justify-between items-center">
                      <span class="text-muted-foreground">Fecha</span>
                      <span class="font-medium">
                        {{ selectedDate ? formatDate(selectedDate) : "No seleccionada" }}
                      </span>
                    </div>
                    <Separator />
                    <div class="flex justify-between items-center">
                      <span class="text-muted-foreground">Horario</span>
                      <span class="font-medium">
                        {{ selectedTime || "No seleccionado" }}
                      </span>
                    </div>
                    <Separator />
                    <div class="flex justify-between items-center">
                      <span class="text-muted-foreground">Pista</span>
                      <span class="font-medium">
                        {{ selectedVenue?.name || "No seleccionada" }}
                      </span>
                    </div>
                    <Separator />
                    <div class="flex justify-between items-center">
                      <span class="font-medium">Total</span>
                      <span class="font-medium">
                        {{ selectedVenue ? `${selectedVenue.fee}€` : "—" }}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog v-model:open="showCreateUserDialog">
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear Nuevo Cliente</DialogTitle>
          </DialogHeader>
          <form @submit="handleCreateUser" class="space-y-4">
            <FormField v-slot="{ field }" name="name">
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input v-bind="field" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ field }" name="surname">
              <FormItem>
                <FormLabel>Apellidos</FormLabel>
                <FormControl>
                  <Input v-bind="field" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ field }" name="email">
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input v-bind="field" type="email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ field }" name="phone">
              <FormItem>
                <FormLabel>Teléfono</FormLabel>
                <FormControl>
                  <Input type="tel" v-bind="field" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <DialogFooter>
              <Button type="button" variant="outline" @click="showCreateUserDialog = false">
                Cancelar
              </Button>
              <Button type="submit" :disabled="createUserLoading">
                <Loader2 v-if="createUserLoading" class="mr-2 h-4 w-4 animate-spin" />
                {{ createUserLoading ? "Creando..." : "Crear Cliente" }}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  </div>
</template>
