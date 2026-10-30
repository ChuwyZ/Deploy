<script setup lang="ts">
import { useLevelStore } from '@/stores/level'

const levelStore = useLevelStore()
</script>

<template>
  <div class="flex flex-col h-full">
    <h2 class="text-xl mb-4 font-bold text-gray-800">Level Information</h2>

    <p class="mb-2"><strong>Level:</strong> {{ levelStore.level?.levelNumber }}</p>
    <p class="mb-2">
      <strong>Pass Criteria Score:</strong> {{ levelStore.level?.passCriteriaScore }}
    </p>

    <div class="mt-6 flex justify-end">
      <RouterLink
        v-if="levelStore.level"
        :to="{ name: 'admin-levelInfoEdit', params: { id: levelStore.level.id } }"
        class="btn-main"
      >
        Change Pass Criteria
      </RouterLink>
    </div>
  </div>
</template>
