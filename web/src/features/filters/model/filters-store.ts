import { defineStore } from 'pinia'
import type { Extenstion, Source } from 'shared/types'

type State = {
  ext: Extenstion
  query: string
  source: Source
}

export const useFilters = defineStore('filters', {
  state: () =>
    <State>{
      ext: 'epub',
      query: '',
      source: 'FLIBUSTA',
    },
  actions: {
    setQuery(query: string) {
      this.query = query
    },
    setExt(ext: Extenstion) {
      this.ext = ext
    },
    setSource(source: Source) {
      this.source = source
    },
  },
})
