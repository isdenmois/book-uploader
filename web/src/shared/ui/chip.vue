<script setup lang="ts">
defineProps<{
  title: string
  selected?: boolean
  disabled?: boolean
}>()
const emit = defineEmits<{ (e: 'select'): void }>()
</script>

<template>
  <button class="chip" :class="{ selected }" :disabled="disabled" @click="emit('select')">{{ title }}</button>
</template>

<style lang="scss">
.chip {
  border: 1px solid var(--secondaryBackground);
  border-radius: 20px;
  color: var(--secondary);
  cursor: pointer;
  margin-left: 8px;
  padding: 4px 12px;
  font-size: 14px;

  &.selected {
    background-color: var(--searchBackground);
    border-color: var(--searchSelected);
    color: var(--searchText);
  }
}
</style>
