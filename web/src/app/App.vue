<script setup lang="ts">
import { useStore } from '@nanostores/vue'

import SearchPage from 'pages/search-page/search-page.vue'
import LoginPage from 'pages/login-page.vue'
import { $showLogin } from './app-model'
import { sourceAtom } from 'features/filters'

const showLogin = useStore($showLogin)
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
