<script lang="ts" setup>
import { useStore } from '@nanostores/vue'
import { Chip } from 'shared/ui'
import { extAtom, sourceAtom } from '../model'

const source = useStore(sourceAtom)
const ext = useStore(extAtom)
</script>

<template>
  <Chip title="Flibusta" :selected="source === 'FLIBUSTA'" @select="sourceAtom.set('FLIBUSTA')" />
  <Chip title="ZLib" :selected="source === 'ZLIB'" @select="sourceAtom.set('ZLIB')" />

  <template v-if="source === 'ZLIB'">
    <div class="w-4" />

    <Chip title="EPUB" :selected="ext === 'epub'" @select="extAtom.set('epub')" />
    <Chip title="FB2" :selected="ext === 'fb2'" @select="extAtom.set('fb2')" />
    <Chip title="PDF" :selected="ext === 'pdf'" @select="extAtom.set('pdf')" />
  </template>
</template>
