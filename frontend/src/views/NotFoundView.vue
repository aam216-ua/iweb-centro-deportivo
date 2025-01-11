<script setup lang="ts">
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle } from "lucide-vue-next"
import { useRouter } from "vue-router"

const router = useRouter()

const irInicio = () => {
  router.push("/")
}

const regresar = () => {
  router.back()
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-muted/10 px-4">
    <Card class="w-full max-w-lg shadow-lg">
      <CardHeader class="space-y-4">
        <div class="mx-auto p-3 rounded-full bg-muted">
          <AlertTriangle class="h-12 w-12 text-muted-foreground" />
        </div>
        <div class="space-y-2 text-center">
          <CardTitle class="text-3xl font-semibold">Página No Encontrada</CardTitle>
          <CardDescription class="text-base"> Error 404 </CardDescription>
        </div>
      </CardHeader>
      <CardContent class="space-y-6">
        <p class="text-muted-foreground text-center">
          No se pudo encontrar la página solicitada. Por favor, verifique la URL o regrese a la
          página de inicio.
        </p>
        <div class="flex justify-center gap-4">
          <Button variant="outline" @click="regresar"> Regresar </Button>
          <Button @click="irInicio"> Inicio </Button>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
