<script setup lang="ts">
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { z } from "@/lib/zod"
import { useAuthStore } from "@/stores/auth"
import { toTypedSchema } from "@vee-validate/zod"
import { Loader2 } from "lucide-vue-next"
import { useForm } from "vee-validate"
import { ref } from "vue"
import { toast } from "vue-sonner"

const PRESET_AMOUNTS = [5, 10, 20, 50, 100, 200]

const rechargeSchema = toTypedSchema(
  z.object({
    amount: z.number().positive().min(0.01).max(999.99),
  }),
)

defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  "update:open": [value: boolean]
  rechargeComplete: []
}>()

const loading = ref(false)
const authStore = useAuthStore()

const form = useForm({
  validationSchema: rechargeSchema,
  initialValues: {
    amount: undefined,
  },
})

const handlePresetAmount = (amount: number) => {
  form.setFieldValue("amount", amount)
}

const onSubmit = form.handleSubmit(async (values) => {
  try {
    loading.value = true
    await authStore.rechargeBalance(values.amount)
    form.resetForm()
    emit("update:open", false)
    toast.success("Saldo recargado exitosamente")
  } catch (error) {
    toast.error("No se pudo recargar el saldo")
  } finally {
    loading.value = false
  }
})

defineOptions({
  name: "RechargeDialog",
})
</script>

<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle class="text-2xl">Recargar Saldo</DialogTitle>
        <DialogDescription>
          Selecciona una cantidad predefinida o introduce una cantidad personalizada.
        </DialogDescription>
      </DialogHeader>

      <form @submit="onSubmit" class="mt-6 grid gap-6">
        <div class="grid grid-cols-3 gap-2">
          <Button
            v-for="amount in PRESET_AMOUNTS"
            :key="amount"
            type="button"
            variant="outline"
            :class="['h-12', form.values.amount === amount && 'border-primary bg-primary/10']"
            @click="handlePresetAmount(amount)"
          >
            €{{ amount }}
          </Button>
        </div>

        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <span class="w-full border-t" />
          </div>
          <div class="relative flex justify-center text-xs uppercase">
            <span class="bg-background px-2 text-muted-foreground"
              >O introduce una cantidad personalizada</span
            >
          </div>
        </div>

        <!-- Custom amount input -->
        <FormField v-slot="{ componentField, errorMessage }" name="amount">
          <FormItem>
            <FormLabel>Cantidad (€)</FormLabel>
            <FormControl>
              <div class="relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >€</span
                >
                <Input
                  v-bind="componentField"
                  type="number"
                  step="0.01"
                  min="0.01"
                  max="999.99"
                  placeholder="0.00"
                  class="pl-7"
                />
              </div>
            </FormControl>
            <FormMessage>{{ errorMessage }}</FormMessage>
          </FormItem>
        </FormField>

        <div class="flex justify-end gap-4">
          <Button type="button" variant="outline" @click="$emit('update:open', false)">
            Cancelar
          </Button>
          <Button type="submit" :disabled="loading">
            <Loader2 v-if="loading" class="mr-2 h-4 w-4 animate-spin" />
            {{ loading ? "Recargando..." : "Recargar" }}
          </Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>
</template>
