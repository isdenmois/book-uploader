<script setup lang="ts">
import type { BookItem } from 'shared/api'
import { FileIcon, Item } from 'shared/ui'

const { book } = defineProps<{ book: BookItem }>()

const emit = defineEmits<{
  (e: 'download'): void
}>()

const subtitle = [book.size, book.lang, book.translation].filter(p => p).join(', ')
const ext = book.ext.replace('.zip', '')
</script>

<template>
  <Item :suptitle="book.authors" :title="book.title" :subtitle="subtitle" @click="emit('download')">
    <template v-slot:icon>
      <FileIcon :text="ext" />
    </template>
  </Item>
</template>
