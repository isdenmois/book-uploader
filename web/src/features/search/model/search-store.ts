import { defineStore } from 'pinia'
// import type { Extenstion, Source } from 'shared/types'
import { api, ProviderType } from 'shared/api'
import type { BookItem } from 'shared/api'
import type { Extenstion } from 'shared/types'

type State = {
  books: BookItem[] | null
  isLoading: boolean
}

export const useSearch = defineStore('search', {
  state: () =>
    <State>{
      books: [],
      isLoading: false,
    },
  actions: {
    async searchBooks(type: ProviderType, query: string, ext: Extenstion = 'fb2') {
      this.books = null
      this.isLoading = true

      try {
        this.books = await api.bookSearch(type, query, ext)
      } catch (e) {
        alert(e)
      }

      this.isLoading = false
    },
  },
})
