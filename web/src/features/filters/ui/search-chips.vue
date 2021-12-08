<script lang="ts" setup>
import { useStore } from '@nanostores/vue'
import { Chip } from 'shared/ui'
import { $ext, $source } from '../model'

const source = useStore($source)
const ext = useStore($ext)
</script>

<template>
  <Chip title="Flibusta" :selected="source === 'FLIBUSTA'" @select="$source.set('FLIBUSTA')" />
  <Chip title="ZLib" :selected="source === 'ZLIB'" @select="$source.set('ZLIB')" />

  <template v-if="source === 'ZLIB'">
    <div class="w-4" />

    <Chip title="EPUB" :selected="ext === 'epub'" @select="$ext.set('epub')" />
    <Chip title="FB2" :selected="ext === 'fb2'" @select="$ext.set('fb2')" />
    <Chip title="PDF" :selected="ext === 'pdf'" @select="$ext.set('pdf')" />
  </template>
</template>
