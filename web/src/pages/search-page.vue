<script lang="ts" setup>
import { SearchFilters, useFilters } from 'features/filters'
import { api } from 'shared/api'
import { useSearch } from 'features/search'
import { BookItem } from 'entities/book'
import { Spinner } from 'shared/ui'
import { onMounted } from 'vue-demi'

const filters = useFilters()
const search = useSearch()

const startSearch = () => {
  search.searchBooks(filters.source, filters.query, filters.ext)

  if (history.replaceState) {
    const url = `${location.protocol}//${location.host}${location.pathname}?q=${filters.query}&ext=${filters.ext}&source=${filters.source}`
    history.replaceState({ path: url }, '', url)
  }
}

let isLoading = $computed(() => search.isLoading)
let books = $computed(() => search.books)

filters.$onAction(() => search.$patch({ books: null }))

onMounted(() => {
  const params = new URLSearchParams(location.search)

  if (params.get('q')) {
    const source: any = params.get('source') || 'FLIBUSTA'
    const query: any = params.get('q')
    const ext: any = params.get('ext') || 'epub'

    filters.$patch({ source, ext, query })

    search.searchBooks(source, query, ext)
  }
})
</script>

<template>
  <div class="pt-4 flex flex-col flex-1 overflow-hidden">
    <SearchFilters @search="startSearch" />

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
