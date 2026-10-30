<script setup lang="ts">
import { useLevelStore } from '@/stores/level'

const levelStore = useLevelStore()
</script>

<template>
  <div>
    <h2 class="text-xl mb-4 font-bold">Services:</h2>
    <div v-for="service in levelStore.services" :key="service.id" class="mb-6">
      <p class="font-bold">
        {{ service.batch }}
      </p>
      <p class="text-sm text-gray-600">
        {{ service.description }}
      </p>
    </div>
  </div>
</template>
