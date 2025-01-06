<script setup lang="ts">
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuthStore } from "@/stores/auth"
import { computed } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()
const authStore = useAuthStore()

const isAuthenticated = computed(() => authStore.isAuthenticated)
const user = computed(() => authStore.user)

const getPersonalizedContent = computed(() => {
  if (!isAuthenticated.value) return null

  return {
    recentActivity: ["Item 1", "Item 2", "Item 3"],
    recommendations: ["Rec 1", "Rec 2", "Rec 3"],
  }
})

const handleLoginClick = () => {
  router.push({ name: "login", query: { redirect: "/" } })
}
</script>

<template>
  <div class="container mx-auto py-8">
    <!-- Authenticated Content -->
    <section v-if="isAuthenticated" class="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{{ user?.name }}!</CardTitle>
        </CardHeader>
      </Card>
    </section>

    <!-- Unauthenticated CTA -->
    <section v-else class="space-y-6">
      <Card>
        <CardContent>
          <Button @click="handleLoginClick" size="lg"> Sign In </Button>
        </CardContent>
      </Card>
    </section>
  </div>
</template>
