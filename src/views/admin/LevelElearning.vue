<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useLevelStore } from '@/stores/level'
import LevelService from '@/service/LevelService'

const levelStore = useLevelStore()
const elearning = ref<any[]>([])

watchEffect(() => {
  if (levelStore.level) {
    LevelService.getElearning(levelStore.level.id)
      .then((response) => {
        elearning.value = response.data
      })
      .catch((error) => {
        console.error(error)
      })
  }
})

function deleteElearning(id: number) {
  if (confirm('Are you sure you want to delete this eLearning content?')) {
    LevelService.deleteElearning(id)
      .then(() => {
        if (levelStore.level) {
          return LevelService.getElearning(levelStore.level.id)
        }
      })
      .then((response) => {
        if (response) elearning.value = response.data
      })
      .catch((error) => {
        console.error(error)
      })
  }
}
</script>

<template>
  <div class="w-full">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold text-gray-800">eLearning List</h2>
      <div v-if="levelStore.level" class="flex gap-3">
        <RouterLink
          :to="{ name: 'admin-levelElearningAdd', params: { id: levelStore.level.id } }"
          class="bg-blue-500 text-white px-4 py-1.5 rounded hover:bg-blue-600 no-underline"
        >
          Add
        </RouterLink>
        <RouterLink
          :to="{ name: 'admin-levelElearningEdit', params: { id: levelStore.level.id } }"
          class="bg-yellow-500 text-white px-4 py-1.5 rounded hover:bg-yellow-600 no-underline"
        >
          Edit
        </RouterLink>
      </div>
    </div>

    <div v-if="elearning.length > 0" class="flex flex-col gap-4">
      <div
        v-for="content in elearning"
        :key="content.id"
        class="p-4 border border-gray-300 rounded bg-white"
      >
        <p class="font-bold mb-2 text-lg">
          {{ content.title }}
        </p>

        <p class="text-gray-700 mb-2"><strong>Video URL:</strong> {{ content.videoUrl }}</p>

        <p class="text-gray-700 mb-3"><strong>Description:</strong> {{ content.description }}</p>

        <div class="flex justify-end gap-2 border-t pt-3 mt-2">
          <button
            type="button"
            @click="deleteElearning(content.id)"
            class="bg-red-500 text-white px-4 py-1.5 rounded hover:bg-red-600 text-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

    <div v-else class="text-center text-gray-500 py-8 border rounded bg-white">
      No eLearning content found for this level.
    </div>
  </div>
</template>
