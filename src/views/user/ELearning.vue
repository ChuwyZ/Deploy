<script setup lang="ts">
import LevelService from '@/service/LevelService'
import { useUserStore } from '@/stores/user'
import { ref, watchEffect } from 'vue'

interface ElearningItem {
  id: number
  title: string
  videoUrl: string
  description?: string
}

const userStore = useUserStore()
const elearning = ref<ElearningItem[]>([])
const loading = ref(true)

// reloads by itself when the level changes (e.g. after passing the exam)
watchEffect(() => {
  if (userStore.user?.level) {
    loading.value = true
    LevelService.getMyElearning()
      .then((response) => {
        elearning.value = response.data
      })
      .catch((error) => {
        console.error(error)
      })
      .finally(() => {
        loading.value = false
      })
  }
})
</script>

<template>
  <div>
    <h2 class="text-xl mb-1 font-bold text-gray-800">E-Learning</h2>
    <p class="text-sm text-gray-600 mb-6">
      Watch these Level {{ userStore.user?.level }} videos before taking the exam.
    </p>

    <p v-if="!loading && elearning.length === 0" class="text-gray-500">
      There are no videos for this level yet.
    </p>

    <div class="flex flex-col gap-6">
      <div
        v-for="(item, index) in elearning"
        :key="item.id"
        class="bg-white border border-blue-100 rounded-xl shadow-sm overflow-hidden"
      >
        <!-- 16:9 player that fills the card -->
        <div class="aspect-video w-full bg-black">
          <iframe
            :src="item.videoUrl"
            :title="item.title"
            class="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
        <div class="p-4">
          <p class="text-xs font-bold uppercase tracking-wider text-blue-600">
            Lesson {{ index + 1 }}
          </p>
          <h3 class="font-bold text-gray-800">{{ item.title }}</h3>
          <p v-if="item.description" class="text-sm text-gray-600 mt-1">{{ item.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
