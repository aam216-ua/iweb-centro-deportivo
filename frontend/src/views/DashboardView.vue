<script setup lang="ts">
import { columns as activityColumns } from "@/components/activities/columns"
import ActivitiesDataTable from "@/components/activities/DataTable.vue"
import { columns as bookingColumns } from "@/components/bookings/columns"
import BookingsDataTable from "@/components/bookings/DataTable.vue"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { columns as userColumns } from "@/components/users/columns"
import UsersDataTable from "@/components/users/DataTable.vue"
import UserCreateDialog from "@/components/users/UserCreateDialog.vue"
import { columns as venueColumns } from "@/components/venues/columns"
import VenuesDataTable from "@/components/venues/DataTable.vue"
import VenueCreateDialog from "@/components/venues/VenueCreateDialog.vue"
import { activitiesService } from "@/services/activity"
import { bookingsService } from "@/services/booking"
import { usersService } from "@/services/user"
import { venuesService } from "@/services/venue"
import type { Activity } from "@/types/activity"
import type { Booking } from "@/types/booking"
import type { User } from "@/types/user"
import type { Venue } from "@/types/venue"
import { RefreshCcw } from "lucide-vue-next"
import { computed, onMounted, ref, watch } from "vue"

const currentTab = ref("bookings")
const activities = ref<Activity[]>([])
const bookings = ref<Booking[]>([])
const users = ref<User[]>([])
const venues = ref<Venue[]>([])
const isLoadingActivities = ref(false)
const isLoadingBookings = ref(false)
const isLoadingUsers = ref(false)
const isLoadingVenues = ref(false)
const showCreateUserDialog = ref(false)
const showCreateVenueDialog = ref(false)
const refreshTriggered = ref(false)

async function fetchActivities() {
  if (currentTab.value !== "activities") return
  isLoadingActivities.value = true
  try {
    const response = await activitiesService.getAll()
    activities.value = response
  } catch (error) {
    console.error("Failed to fetch activities:", error)
  } finally {
    isLoadingActivities.value = false
  }
}

async function fetchBookings() {
  if (currentTab.value !== "bookings") return
  isLoadingBookings.value = true
  try {
    const response = await bookingsService.getAll()
    bookings.value = response.data
  } catch (error) {
    console.error("Failed to fetch bookings:", error)
  } finally {
    isLoadingBookings.value = false
  }
}

async function fetchUsers() {
  if (currentTab.value !== "users") return
  isLoadingUsers.value = true
  try {
    const response = await usersService.getAll()
    users.value = response.data
  } catch (error) {
    console.error("Failed to fetch users:", error)
  } finally {
    isLoadingUsers.value = false
  }
}

async function fetchVenues() {
  if (currentTab.value !== "venues") return
  isLoadingVenues.value = true
  try {
    const response = await venuesService.getAll()
    venues.value = response.data
  } catch (error) {
    console.error("Failed to fetch venues:", error)
  } finally {
    isLoadingVenues.value = false
  }
}

const updateTabInfo = async (tab: string) => {
  if (tab === "activities") await fetchActivities()
  if (tab === "users") await fetchUsers()
  if (tab === "venues") await fetchVenues()
  if (tab === "bookings") await fetchBookings()
}

const somethingIsLoading = computed(
  () =>
    isLoadingVenues.value ||
    isLoadingUsers.value ||
    isLoadingActivities.value ||
    isLoadingBookings.value,
)

watch(currentTab, (newTab) => {
  updateTabInfo(newTab)
})

onMounted(() => {
  updateTabInfo(currentTab.value)
})

const triggerRefresh = async () => {
  refreshTriggered.value = true
  await updateTabInfo(currentTab.value)
  refreshTriggered.value = false
}
</script>

<template>
  <div class="container mx-auto py-8">
    <div class="flex items-center justify-between space-y-2">
      <h2 class="text-2xl sm:text-3xl font-bold tracking-tight">Panel de Administración</h2>
    </div>

    <Tabs v-model="currentTab" class="mt-6 space-y-4">
      <div class="flex space-x-2 h-10">
        <TabsList class="min-w-0">
          <TabsTrigger value="bookings" class="min-w-0 truncate"
            ><span class="truncate min-w-0">Reservas</span></TabsTrigger
          >
          <TabsTrigger value="venues" class="min-w-0 truncate"
            ><span class="truncate min-w-0">Pistas</span></TabsTrigger
          >
          <TabsTrigger value="users" class="min-w-0 truncate"
            ><span class="truncate min-w-0">Usuarios</span></TabsTrigger
          >
          <TabsTrigger value="activities" class="min-w-0 truncate"
            ><span class="truncate min-w-0">Actividades</span></TabsTrigger
          >
        </TabsList>
        <Button
          @click="triggerRefresh"
          :disabled="somethingIsLoading || refreshTriggered"
          variant="outline"
          size="icon"
          class="size-10 shrink-0"
        >
          <RefreshCcw :class="refreshTriggered && 'animate-spin'" class="w-4 h-4" />
        </Button>
      </div>

      <TabsContent value="venues" class="space-y-4">
        <div v-if="isLoadingVenues">Cargando pistas...</div>
        <VenuesDataTable
          v-else
          :columns="venueColumns"
          :data="venues"
          @create="showCreateVenueDialog = true"
        />
        <VenueCreateDialog v-model:open="showCreateVenueDialog" @venue-created="fetchVenues" />
      </TabsContent>

      <TabsContent value="bookings" class="space-y-4">
        <div v-if="isLoadingBookings">Cargando reservas...</div>
        <BookingsDataTable v-else :columns="bookingColumns" :data="bookings" />
      </TabsContent>

      <TabsContent value="users" class="space-y-4">
        <div v-if="isLoadingUsers">Cargando usuarios...</div>
        <UsersDataTable
          v-else
          :columns="userColumns"
          :data="users"
          @create="showCreateUserDialog = true"
        />
        <UserCreateDialog v-model:open="showCreateUserDialog" @user-created="fetchUsers" />
      </TabsContent>

      <TabsContent value="activities" class="space-y-4">
        <div v-if="isLoadingActivities">Cargando actividades...</div>
        <ActivitiesDataTable v-else :columns="activityColumns" :data="activities" />
      </TabsContent>
    </Tabs>
  </div>
</template>
