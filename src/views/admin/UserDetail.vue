<script setup lang="ts">
import { watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import UserService from '@/service/UserService'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const userStore = useUserStore()

watchEffect(() => {
  const id = parseInt(route.params.id as string)
  if (id) {
    UserService.getUser(id)
      .then((response) => {
        userStore.setUser(response.data)
      })
      .catch((error) => {
        console.error(error)
      })
  }
})
</script>

<template>
  <div v-if="userStore.user" class="mt-8 flex flex-col items-center">
    <div class="mb-4 text-center">
      <img :src="userStore.user.profileImage[0]" class="w-24 h-24 rounded-full mx-auto" />
      <h1 class="text-2xl mt-2">{{ userStore.user.name }} {{ userStore.user.surname }}</h1>
    </div>

    <div class="flex gap-4 mb-4 font-semibold">
      <RouterLink :to="{ name: 'admin-userInfo' }" exact-active-class="text-blue-600 underline">
        Info
      </RouterLink>

      <RouterLink :to="{ name: 'admin-userHistory' }" exact-active-class="text-blue-600 underline"
        >History</RouterLink
      >

      <RouterLink :to="{ name: 'admin-userEdit' }" exact-active-class="text-blue-600 underline"
        >Edit</RouterLink
      >
    </div>

    <div class="border border-gray-300 p-4 rounded w-[400px] bg-gray-50">
      <router-view></router-view>
    </div>
  </div>
</template>
