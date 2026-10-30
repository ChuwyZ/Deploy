<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useUserStore } from '@/stores/user'
import UserService from '@/service/UserService'

const userStore = useUserStore()
const histories = ref<any[]>([])

const formatDate = (dateStr?: string) => (dateStr ? new Date(dateStr).toLocaleString('th-TH') : '-')

watchEffect(() => {
  if (userStore.user) {
    UserService.getExamHistory(userStore.user.id)
      .then((res) => {
        histories.value = res.data
      })
      .catch((err) => console.error(err))
  }
})
</script>

<template>
  <div>
    <h1 class="text-xl mb-4 font-bold text-gray-800">Exam History</h1>

    <div v-if="histories.length > 0" class="flex flex-col gap-3">
      <div v-for="history in histories" :key="history.id">
        <p><strong>Level:</strong> {{ history.levelId ?? history.levelAttempted }}</p>
        <p><strong>Score:</strong> {{ history.score }}</p>
        <p><strong>Result:</strong> {{ history.isPassed ? 'Passed' : 'Failed' }}</p>
        <p><strong>Date:</strong> {{ formatDate(history.attemptedAt ?? history.dateTime) }}</p>
      </div>
    </div>

    <div v-else>No exam history found</div>
  </div>
</template>
