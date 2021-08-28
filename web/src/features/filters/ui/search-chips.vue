<script lang="ts" setup>
import { computed } from 'vue'
import { Chip } from 'shared/ui'
import { useFilters } from '../'

const filters = useFilters()

const source = computed(() => filters.source)
const ext = computed(() => filters.ext)
</script>

<template>
  <Chip title="Flibusta" :selected="source === 'FLIBUSTA'" @select="filters.setSource('FLIBUSTA')" />
  <Chip title="ZLib" :selected="source === 'ZLIB'" @select="filters.setSource('ZLIB')" />

  <template v-if="source === 'ZLIB'">
    <div class="w-4" />

    <Chip title="EPUB" :selected="ext === 'epub'" @select="filters.setExt('epub')" />
    <Chip title="FB2" :selected="ext === 'fb2'" @select="filters.setExt('fb2')" />
    <Chip title="PDF" :selected="ext === 'pdf'" @select="filters.setExt('pdf')" />
  </template>
</template>
