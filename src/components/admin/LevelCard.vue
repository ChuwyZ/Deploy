<script setup lang="ts">
import type { Level } from '@/type'

defineProps<{
  level: Level
}>()
</script>

<template>
  <RouterLink
    class="no-underline text-black block"
    :to="{ name: 'admin-levelDetail', params: { id: level.id } }"
  >
    <div
      class="border border-gray-400 p-4 rounded hover:shadow-lg flex items-center gap-4 bg-white cursor-pointer hover:scale-[1.01] transition-all"
    >
      <div class="flex items-center gap-4">
        <p class="font-bold text-lg">Level {{ level.levelNumber }}</p>
      </div>
    </div>
  </RouterLink>
</template>
