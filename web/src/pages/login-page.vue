<script setup lang="ts">
import { useAuth } from 'features/auth'
import { api } from 'shared/api'
import { Input, EmailIcon, KeyIcon } from 'shared/ui'
import Button from 'shared/ui/button.vue'

const auth = useAuth()
let email = $ref(import.meta.env.VITE_INITIAL_EMAIL)
let password = $ref(import.meta.env.VITE_INITIAL_PASSWORD)
let inProgress = $ref(false)

const login = async () => {
  if (!email || !password) {
    return
  }

  inProgress = true

  try {
    const cookie = await api.sendLogin(email, password)

    auth.setCookie(cookie)
  } catch (e) {
    alert(e)
  }

  inProgress = false
}
</script>

<template>
  <div class="pt-4 px-4">
    <h1>Login</h1>

    <form class="mt-4" @submit.prevent="login">
      <Input v-model:value="email" placeholder="E-Mail" :disabled="inProgress">
        <template v-slot:icon>
          <EmailIcon />
        </template>
      </Input>

      <div class="mt-2">
        <Input v-model:value="password" type="password" placeholder="Password" :disabled="inProgress">
          <template v-slot:icon>
            <KeyIcon />
          </template>
        </Input>
      </div>

      <div class="mt-4 text-center">
        <Button type="submit" :disabled="inProgress">Login</Button>
      </div>
    </form>
  </div>
</template>
