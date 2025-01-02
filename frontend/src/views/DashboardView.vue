<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// import VenuesTable from './components/VenuesTable.vue'
// import UsersTable from './components/UsersTable.vue'
// import ActivitiesTable from './components/ActivitiesTable.vue'
</script>

<template>
  <div class="container mx-auto py-8">
    <div class="flex items-center justify-between space-y-2">
      <h2 class="text-3xl font-bold tracking-tight">Panel de Administración</h2>
      <div class="flex items-center space-x-2"></div>
    </div>

    <Tabs default-value="venues" class="mt-6 space-y-4">
      <TabsList>
        <TabsTrigger value="venues">Pistas</TabsTrigger>
        <TabsTrigger value="users">Usuarios</TabsTrigger>
        <TabsTrigger value="activities">Actividades</TabsTrigger>
      </TabsList>

      <TabsContent value="venues" class="space-y-4">
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader class="space-y-0 pb-2">
              <CardTitle class="text-sm font-medium"> Total Pistas </CardTitle>
            </CardHeader>
            <CardContent>
              <div class="text-2xl font-bold">0</div>
              <p class="text-xs text-muted-foreground">Pistas registradas en el sistema</p>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="users" class="space-y-4">
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader class="space-y-0 pb-2">
              <CardTitle class="text-sm font-medium"> Total Usuarios </CardTitle>
            </CardHeader>
            <CardContent>
              <div class="text-2xl font-bold">0</div>
              <p class="text-xs text-muted-foreground">Usuarios registrados en el sistema</p>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="activities" class="space-y-4">
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader class="space-y-0 pb-2">
              <CardTitle class="text-sm font-medium"> Total Actividades </CardTitle>
            </CardHeader>
            <CardContent>
              <div class="text-2xl font-bold">0</div>
              <p class="text-xs text-muted-foreground">Actividades disponibles en el sistema</p>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  </div>
</template>
