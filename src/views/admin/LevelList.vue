<script setup lang="ts">
import { ref, onMounted } from 'vue'
import LevelService from '@/service/LevelService'
import type { Level } from '@/type'
import LevelCard from '@/components/admin/LevelCard.vue'

const levels = ref<Level[]>([])

onMounted(() => {
  LevelService.getLevels()
    .then((response) => {
      levels.value = response.data
    })
    .catch((error) => {
      console.error(error)
    })
})
</script>

<template>
  <div class="flex flex-col items-center mt-8">
    <h1 class="text-2xl mb-6 font-bold">Level List</h1>

    <div v-if="levels.length > 0" class="flex flex-col gap-4 w-[500px]">
      <LevelCard v-for="level in levels" :key="level.id" :level="level" />
    </div>
  </div>
</template>
