<script lang="ts" setup>
import SearchInput from './search-input.vue'
import SearchChips from './search-chips.vue'

defineEmits(['search'])
</script>

<template>
  <form @submit.prevent="$emit('search')" class="px-4">
    <SearchInput />
  </form>

  <div class="flex flex-row mt-4 mx-2 overflow-x-auto pb-2">
    <SearchChips />
  </div>
</template>
