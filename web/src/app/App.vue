<script setup lang="ts">
import SearchPage from 'pages/search-page.vue'
import LoginPage from 'pages/login-page.vue'
import { useAuth } from 'features/auth'
import { useFilters } from 'features/filters'

const auth = useAuth()
const filters = useFilters()
let showLogin = $computed(() => filters.source === 'ZLIB' && !auth.cookie)
</script>

<template>
  <component :is="showLogin ? LoginPage : SearchPage" />
</template>

<style>
#app {
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
</style>
