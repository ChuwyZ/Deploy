<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useLevelStore } from '@/stores/level'
import LevelService from '@/service/LevelService'

const levelStore = useLevelStore()
const services = ref<any[]>([])

function loadServices() {
  if (levelStore.level) {
    LevelService.getServices(levelStore.level.id)
      .then((response) => {
        services.value = response.data
      })
      .catch((error) => {
        console.error(error)
      })
  }
}

watchEffect(() => {
  if (levelStore.level) {
    loadServices()
  }
})

function deleteService(id: number) {
  if (confirm('Are you sure you want to delete this service?')) {
    LevelService.deleteService(id)
      .then(() => loadServices())
      .catch((error) => {
        console.error(error)
        alert('Failed to delete service.')
      })
  }
}
</script>

<template>
  <div class="w-full">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold text-gray-800">Level Services</h2>
      <div v-if="levelStore.level" class="flex gap-2">
        <RouterLink
          :to="{ name: 'admin-levelServiceAdd', params: { id: levelStore.level.id } }"
          class="bg-blue-500 text-white px-4 py-1.5 rounded hover:bg-blue-600 no-underline"
        >
          Add
        </RouterLink>
        <RouterLink
          :to="{ name: 'admin-levelServiceEdit', params: { id: levelStore.level.id } }"
          class="bg-yellow-500 text-white px-4 py-1.5 rounded hover:bg-yellow-600 no-underline"
        >
          Edit
        </RouterLink>
      </div>
    </div>

    <div v-if="services.length > 0" class="flex flex-col gap-4">
      <div
        v-for="service in services"
        :key="service.id"
        class="p-4 border border-gray-300 rounded bg-white"
      >
        <p class="font-bold mb-2 text-lg">
          Batch: {{ service.batch }}
        </p>

        <p class="text-gray-700 mb-3">
          {{ service.description }}
        </p>

        <div class="flex justify-end gap-2 border-t pt-3 mt-2">
          <button
            type="button"
            @click="deleteService(service.id)"
            class="bg-red-500 text-white px-4 py-1.5 rounded hover:bg-red-600 text-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

    <div v-else class="text-center text-gray-500 py-8 border rounded bg-white">
      No services found for this level.
    </div>
  </div>
</template>
