<script setup lang="ts">
import HeaderReserve from "@/components/HeaderReserve.vue"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-vue-next"
</script>

<template>
  <header class="sticky top-0 z-40 w-full border-b bg-background">
    <div class="container flex h-16 items-center px-4">
      <div class="flex flex-1">
        <Sheet>
          <SheetTrigger as-child class="md:hidden">
            <Button variant="ghost" size="icon" class="mr-2">
              <Menu class="h-6 w-6" />
              <span class="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav class="grid gap-6 py-6 uppercase">
              <a href="#" class="text-lg font-medium">Información</a>
              <a href="#" class="text-lg font-medium">Hazte socio</a>
            </nav>
          </SheetContent>
        </Sheet>
        <a href="/" class="mr-6 flex items-center space-x-2">
          <img src="/placeholder.svg" alt="Logo" class="h-6 w-auto" />
        </a>
        <nav class="hidden md:flex items-center space-x-6 text-sm font-medium">
          <a href="#" class="transition-colors hover:text-foreground/80">Información</a>
          <a href="#" class="transition-colors hover:text-foreground/80">Hazte socio</a>
        </nav>
      </div>
      <div class="flex items-center space-x-4">
        <HeaderReserve />
      </div>
    </div>
  </header>
</template>
