<script lang="ts" setup>
import { useStore } from '@nanostores/vue'

import { api } from 'shared/api'
import { $books, $isLoading } from 'features/search'

import { SearchFilters } from 'features/filters'
import { BookItem } from 'entities/book'
import { Spinner } from 'shared/ui'

import { startSearch } from './search-model'

const books = useStore($books)
const isLoading = useStore($isLoading)
</script>

<template>
  <div class="pt-4 flex flex-col flex-1 overflow-hidden">
    <SearchFilters @search="startSearch" :disabled="isLoading" />

    <Spinner v-if="isLoading" />

    <div v-if="books?.length" class="book-list flex-1 p-2 overflow-y-auto">
      <BookItem v-for="book in books" :book="book" @download="api.downloadFile(book)" />
    </div>
  </div>
</template>

<style>
.book-list > div:not(:first-child) {
  @apply mt-4;
}
</style>
