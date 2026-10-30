<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import LevelService from '@/service/LevelService'

const route = useRoute()
const levelId = Number(route.params.id)
const benefits = ref<any[]>([])

function loadBenefits() {
  LevelService.getBenefits(levelId)
    .then((res) => {
      benefits.value = res.data
    })
    .catch((err) => console.error(err))
}

onMounted(() => {
  loadBenefits()
})

function deleteBenefit(id: number) {
  if (confirm('Are you sure you want to delete this benefit?')) {
    LevelService.deleteBenefit(id)
      .then(() => loadBenefits())
      .catch((err) => {
        console.error(err)
        alert('Failed to delete benefit.')
      })
  }
}
</script>

<template>
  <div class="w-full">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold">Benefits List</h2>
      <div class="flex gap-2">
        <RouterLink
          :to="{ name: 'admin-levelBenefitAdd', params: { id: levelId } }"
          class="bg-blue-500 text-white px-4 py-1.5 rounded hover:bg-blue-600 no-underline"
        >
          Add
        </RouterLink>
        <RouterLink
          :to="{ name: 'admin-levelBenefitEdit', params: { id: levelId } }"
          class="bg-yellow-500 text-white px-4 py-1.5 rounded hover:bg-yellow-600 no-underline"
        >
          Edit
        </RouterLink>
      </div>
    </div>

    <div v-if="benefits.length > 0" class="flex flex-col gap-4">
      <div
        v-for="benefit in benefits"
        :key="benefit.id"
        class="p-4 border border-gray-300 rounded bg-white"
      >
        <p class="font-bold mb-2 text-lg">{{ benefit.title }}</p>
        <p class="text-gray-700 mb-3">{{ benefit.description }}</p>

        <div class="flex justify-end gap-2 border-t pt-3 mt-2">

          <button
            type="button"
            @click="deleteBenefit(benefit.id)"
            class="bg-red-500 text-white px-4 py-1.5 rounded hover:bg-red-600 text-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

    <div v-else class="text-center text-gray-500 py-8 border rounded bg-white">
      No benefits found for this level.
    </div>
  </div>
</template>
