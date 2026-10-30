<script setup lang="ts">
import { watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import LevelService from '@/service/LevelService'
import { useLevelStore } from '@/stores/level'

const route = useRoute()
const levelStore = useLevelStore()

watchEffect(() => {
  const id = parseInt(route.params.id as string)
  if (id) {
    LevelService.getLevel(id)
      .then((response) => {
        levelStore.setLevel(response.data)
      })
      .catch((error) => {
        console.error(error)
      })
  }
})
</script>

<template>
  <div v-if="levelStore.level" class="mt-8 flex flex-col items-center w-full px-4">
    <div class="mb-4 text-center">
      <h1 class="text-3xl mt-2 font-bold text-gray-800">Level {{ levelStore.level.levelNumber }}</h1>
    </div>

<div class="flex gap-6 mb-6 font-semibold text-lg">
  <RouterLink :to="{ name: 'admin-levelInfo' }" exact-active-class="text-blue-600 underline">
    Info
  </RouterLink>
  <RouterLink :to="{ name: 'admin-levelBenefit' }" exact-active-class="text-blue-600 underline">
    Benefits
  </RouterLink>
  <RouterLink :to="{ name: 'admin-levelService' }" exact-active-class="text-blue-600 underline">
    Services
  </RouterLink>
  <RouterLink :to="{ name: 'admin-levelElearning' }" exact-active-class="text-blue-600 underline">
    eLearning
  </RouterLink>
  <RouterLink :to="{ name: 'admin-levelQuestion' }"exact-active-class="text-blue-600 underline">
    Questions
  </RouterLink>
</div>

    <div class="border border-gray-300 p-6 rounded-lg w-full max-w-4xl bg-gray-50 shadow-sm">
      <router-view></router-view>
    </div>
  </div>
</template>
