<script setup lang="ts">
import { columns } from "@/components/activities/columns"
import DataTable from "@/components/activities/DataTable.vue"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { activitiesService } from "@/services/activity"
import type { Activity } from "@/types/activity"
import { ref, watch } from "vue"

const currentTab = ref("venues")
const activities = ref<Activity[]>([])
const isLoading = ref(false)

async function fetchActivities() {
  if (currentTab.value !== "activities") return

  isLoading.value = true
  try {
    const response = await activitiesService.getAll()
    activities.value = response
  } catch (error) {
    console.error("Failed to fetch activities:", error)
  } finally {
    isLoading.value = false
  }
}

watch(currentTab, fetchActivities)
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
        <!-- UsersTable component will go here -->
      </TabsContent>

      <TabsContent value="activities" class="space-y-4">
        <div v-if="isLoading">Cargando actividades...</div>
        <DataTable v-else :columns="columns" :data="activities" />
      </TabsContent>
    </Tabs>
  </div>
</template>
