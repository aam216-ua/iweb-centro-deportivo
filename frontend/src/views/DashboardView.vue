<script setup lang="ts">
import { columns as activityColumns } from "@/components/activities/columns"
import { columns as userColumns } from "@/components/users/columns"
import UserCreateDialog from "@/components/users/UserCreateDialog.vue"
import ActivitiesDataTable from "@/components/activities/DataTable.vue"
import UsersDataTable from "@/components/users/DataTable.vue"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { activitiesService } from "@/services/activity"
import { usersService } from "@/services/user"
import type { Activity } from "@/types/activity"
import type { User } from "@/types/user"
import { ref, watch } from "vue"


const currentTab = ref("venues")
const activities = ref<Activity[]>([])
const users = ref<User[]>([])
const isLoadingActivities = ref(false)
const isLoadingUsers = ref(false)
const showCreateDialog = ref(false)

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

watch(currentTab, async (newTab) => {
  if (newTab === "activities") await fetchActivities()
  if (newTab === "users") await fetchUsers()
})
</script>

<template>
  <div class="container mx-auto py-8">
    <div class="flex items-center justify-between space-y-2">
      <h2 class="text-3xl font-bold tracking-tight">Panel de Administración</h2>
    </div>

    <Tabs v-model="currentTab" class="mt-6 space-y-4">
      <TabsList>
        <TabsTrigger value="venues">Pistas</TabsTrigger>
        <TabsTrigger value="users">Usuarios</TabsTrigger>
        <TabsTrigger value="activities">Actividades</TabsTrigger>
      </TabsList>

      <TabsContent value="venues" class="space-y-4">
        <!-- VenuesTable component will go here -->
      </TabsContent>

      <TabsContent value="users" class="space-y-4">
        <div v-if="isLoadingUsers">Cargando usuarios...</div>
        <UsersDataTable
          v-else
          :columns="userColumns"
          :data="users"
          @create="showCreateDialog = true"
        />
        <UserCreateDialog
          v-model:open="showCreateDialog"
          @user-created="fetchUsers"
        />
      </TabsContent>

      <TabsContent value="activities" class="space-y-4">
        <div v-if="isLoadingActivities">Cargando actividades...</div>
        <ActivitiesDataTable v-else :columns="activityColumns" :data="activities" />
      </TabsContent>
    </Tabs>
  </div>
</template>
