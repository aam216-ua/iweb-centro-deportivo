<script setup lang="ts">
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { reserveSchema } from "@/schemas/reserve"
import { TimeSlots } from "@/types/reserve"
import { getLocalTimeZone, parseDate, today } from "@internationalized/date"
import { useForm } from "vee-validate"
import { computed, ref } from "vue"
import { toast } from "vue-sonner"

const placeholder = ref()
const { handleSubmit, setFieldValue, values } = useForm({
  validationSchema: reserveSchema,
})

const tomorrow = today(getLocalTimeZone()).add({ days: 1 })
const maxDate = tomorrow.add({ days: 14 })

const value = computed({
  get: () => (values.date ? parseDate(values.date) : undefined),
  set: (val) => val,
})

const onSubmit = handleSubmit((values) => {
  try {
    toast.message(JSON.stringify(values))
  } catch (error) {
    toast.error("Error")
  }
})
</script>

<template>
  <div class="container mx-auto py-8">
    <div class="grid gap-2">
      <h1 class="text-3xl font-bold">Reservas</h1>
      <p class="text-balance text-muted-foreground">
        Selecciona una fecha y horario para tu reserva
      </p>
    </div>

    <form class="mt-6 space-y-8" @submit="onSubmit">
      <div class="grid gap-6 md:grid-cols-2">
        <FormField name="date">
          <FormItem class="flex flex-col">
            <FormLabel>Fecha de Reserva</FormLabel>
            <FormControl>
              <div class="w-fit">
                <Calendar
                  v-model:placeholder="placeholder"
                  v-model="value"
                  class="border rounded-md"
                  locale="es"
                  :min-value="tomorrow"
                  :max-value="maxDate"
                  @update:model-value="
                    (v) => {
                      if (v) {
                        setFieldValue('date', v.toString())
                      } else {
                        setFieldValue('date', undefined)
                      }
                    }
                  "
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="time">
          <FormItem>
            <FormLabel>Horario</FormLabel>
            <Select v-bind="componentField">
              <FormControl>
                <SelectTrigger class="max-w-40">
                  <SelectValue placeholder="Selecciona un horario" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectGroup>
                  <SelectItem v-for="(label, value) in TimeSlots" :key="value" :value="value">
                    {{ label }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>

      <Button type="submit"> Reservar </Button>
    </form>
  </div>
</template>
