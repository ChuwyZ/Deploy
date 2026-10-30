<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { useUserStore } from '@/stores/user'
import UserService from '@/service/UserService'

const userStore = useUserStore()

// ดึงประวัติการสอบล่าสุดจาก Backend
watchEffect(() => {
  if (userStore.user?.id) {
    UserService.getExamHistory(userStore.user.id)
      .then((res) => {
        userStore.setExamHistory(res.data)
      })
      .catch((err) => console.error('Error loading history:', err))
  }
})

const histories = computed(() => userStore.examHistory)

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<template>
  <div>
    <h2 class="text-xl mb-4 font-bold text-gray-800">Exam History</h2>
    <div
      v-if="histories.length > 0"
      class="overflow-x-auto rounded border border-gray-200 shadow-sm"
    >
      <table class="min-w-full text-sm text-left text-gray-700">
        <thead class="uppercase bg-gray-100 text-gray-600 text-xs border-b">
          <tr>
            <th class="px-4 py-3">Date</th>
            <th class="px-4 py-3 text-center">Level</th>
            <th class="px-4 py-3 text-center">Score</th>
            <th class="px-4 py-3 text-center">Result</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in histories" :key="item.id" class="border-b bg-white hover:bg-gray-50">
            <!--  attempt และ dateTime -->
            <td class="px-4 py-3">{{ formatDate(item.attemptedAt ?? item.dateTime) }}</td>
            <!-- levelId และ level -->
            <td class="px-4 py-3 text-center font-medium">
              Level {{ item.levelId ?? item.levelAttempted }}
            </td>
            <td class="px-4 py-3 text-center font-semibold">{{ item.score }}</td>
            <td
              class="px-4 py-3 text-center font-bold"
              :class="item.isPassed ? 'text-green-600' : 'text-red-600'"
            >
              {{ item.isPassed ? 'PASSED' : 'FAILED' }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else class="text-center p-6 text-sm text-gray-500 bg-white rounded border">
      No exam history found
    </div>
  </div>
</template>
