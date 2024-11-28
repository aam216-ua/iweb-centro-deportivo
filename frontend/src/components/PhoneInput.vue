<script lang="ts" setup>
import FlagComponent from "@/components/FlagComponent.vue"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useFocus } from "@vueuse/core"
import PhoneInput from "base-vue-phone-input"
import { ChevronsUpDown } from "lucide-vue-next"
import { ref } from "vue"

const props = defineProps<{
  modelValue?: string
}>()

const emit = defineEmits<{
  "update:modelValue": [value: string]
}>()

const open = ref(false)
const phoneInput = ref(null)
const { focused } = useFocus(phoneInput)
const currentPrefix = ref("+34")

const handleInput = (e: Event, updateInputValue: (value: string) => void) => {
  const target = e.target as HTMLInputElement
  updateInputValue(target.value)
  emit("update:modelValue", `${currentPrefix.value} ${target.value}`)
}

const handleCountrySelect = (
  option: { dialCode: string; iso2: string },
  updateInputValue: (value: string) => void,
) => {
  updateInputValue(option.iso2)
  currentPrefix.value = option.dialCode
  open.value = false
  focused.value = true
}
</script>

<template>
  <PhoneInput
    noUseBrowserLocale
    fetchCountry
    class="flex"
    country-locale="es-ES"
    :ignored-countries="['AC']"
  >
    <template #selector="{ inputValue, updateInputValue, countries }">
      <Popover v-model:open="open">
        <PopoverTrigger>
          <Button
            variant="outline"
            type="button"
            tabindex="-1"
            class="flex gap-1 rounded-e-none border-r-0 rounded-s-lg px-3 h-10"
          >
            <FlagComponent :country="inputValue" />
            <ChevronsUpDown class="-mr-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent class="w-[300px] p-0">
          <Command>
            <CommandInput placeholder="Buscar país..." />
            <CommandEmpty>No se encuentra el país.</CommandEmpty>
            <CommandList>
              <CommandGroup>
                <CommandItem
                  v-for="option in countries"
                  :key="option.iso2"
                  :value="option.name"
                  class="gap-2"
                  @select="() => handleCountrySelect(option, updateInputValue)"
                >
                  <span class="flex-1 text-sm">{{ option.name }}</span>
                  <span class="text-foreground/50 text-sm">{{ option.dialCode }}</span>
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </template>
    <template #input="{ inputValue, updateInputValue }">
      <Input
        ref="phoneInput"
        class="rounded-e-lg rounded-s-none"
        type="text"
        :model-value="inputValue"
        @input="(e: Event) => handleInput(e, updateInputValue)"
      />
    </template>
  </PhoneInput>
</template>
