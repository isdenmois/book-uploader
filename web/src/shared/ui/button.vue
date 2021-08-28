<script setup lang="ts">
defineProps<{
  disabled?: boolean
  type?: string
}>()
</script>
<template>
  <button :disabled="disabled" :type="type">
    <slot />
  </button>
</template>

<style scoped>
button {
  background-color: var(--profileSelected);
  border-radius: 10px;
  color: var(--invertedText);
  cursor: pointer;
  font-weight: bold;
  padding: 5px 20px;
}

button:disabled {
  opacity: 0.4;
}
</style>
