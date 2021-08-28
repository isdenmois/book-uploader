<script setup lang="ts">
import { useSlots } from 'vue'

defineProps<{
  suptitle?: string
  title: string
  subtitle?: string
}>()
const emit = defineEmits<{
  (e: 'click'): void
}>()

const slots = useSlots()
</script>

<template>
  <div class="flex flex-row items-center cursor-pointer" @click="emit('click')">
    <div v-if="slots.icon" class="mr-1">
      <slot name="icon" />
    </div>

    <div class="flex-1">
      <div v-if="suptitle" class="text-xs text-secondary">
        {{ suptitle }}
      </div>

      <div class="text-primary">
        {{ title }}
      </div>

      <div v-if="subtitle" class="text-xs text-secondary">
        {{ subtitle }}
      </div>
    </div>
  </div>
</template>
