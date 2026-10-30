<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import ExamService from '@/service/ExamService'
import { useUserStore } from '@/stores/user'
import type { TakeExamQuestionDTO, ExamSubmitResponseDTO } from '@/type'
import UserService from '@/service/UserService'

const userStore = useUserStore()
const questions = ref<TakeExamQuestionDTO[]>([])
const answers = ref<Record<number, number>>({})

const showModal = ref(false)
const examResult = ref<ExamSubmitResponseDTO | null>(null)
const isLoading = ref(false)

const isMaxLevel = computed(() => (userStore.user?.level ?? 1) >= 4)

watchEffect(() => {
  if (userStore.user?.level && !isMaxLevel.value) {
    ExamService.takeExam(userStore.user.level)
      .then((res) => {
        questions.value = res.data
        answers.value = {} // เคลียร์คำตอบใหม่
      })
      .catch((err) => console.error(err))
  }
})

// ดัก Validation ตอบครบทุกข้อหรือยัง
const isAllAnswered = computed(() => {
  if (questions.value.length === 0) return false
  return questions.value.every((q) => answers.value[q.id] !== undefined)
})

async function submitExam() {
  if (!userStore.user) return
  isLoading.value = true

  const payload = {
    userId: userStore.user.id,
    levelId: userStore.user.level,
    answers: answers.value,
  }

  try {
    const response = await ExamService.submitExam(payload)
    examResult.value = response.data
    showModal.value = true

    // Up Level ทันทีเมื่อสอบผ่าน
    if (response.data.isPassed && response.data.newLevel > (userStore.user.level ?? 1)) {
      userStore.user.level = response.data.newLevel
    }

    // ดึงประวัติการสอบล่าสุดจาก Backend
    const historyRes = await UserService.getExamHistory(userStore.user.id)
    userStore.setExamHistory(historyRes.data)
  } catch (error) {
    console.error('Error submitting exam:', error)
  } finally {
    isLoading.value = false
  }
}

function closeModal() {
  showModal.value = false
}
</script>

<template>
  <div class="relative">
    <div v-if="isMaxLevel" class="text-center py-8">
      <h2 class="text-2xl font-bold text-yellow-600 mb-2">Highest Level Reached</h2>
      <p class="text-gray-600">
        You are currently at level 4, the highest level and cannot be promoted.
      </p>
    </div>

    <div v-else>
      <h2 class="text-xl mb-4 font-bold text-gray-800">
        Upgrade Exam: Level {{ userStore.user?.level }}
      </h2>

      <div v-if="questions.length > 0">
        <div
          v-for="(question, index) in questions"
          :key="question.id"
          class="mb-5 p-4 border border-gray-200 rounded-md bg-gray-50"
        >
          <p class="mb-3 font-semibold text-gray-800 text-sm">
            {{ index + 1 }}. {{ question.title }}
          </p>
          <div class="flex flex-col gap-2 ml-2">
            <label
              v-for="choice in question.choices"
              :key="choice.id"
              class="flex items-center gap-2 cursor-pointer hover:bg-white p-2 rounded border border-transparent hover:border-gray-300 text-sm"
            >
              <input
                type="radio"
                :name="'question-' + question.id"
                :value="choice.id"
                v-model="answers[question.id]"
                class="w-4 h-4 text-blue-600 cursor-pointer"
              />
              <span>{{ choice.choiceText }}</span>
            </label>
          </div>
        </div>

        <button
          :disabled="!isAllAnswered || isLoading"
          @click="submitExam"
          :class="[
            'w-full py-2.5 rounded font-semibold text-white transition-all',
            isAllAnswered && !isLoading
              ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer shadow'
              : 'bg-gray-400 cursor-not-allowed opacity-60',
          ]"
        >
          Submit Exam
        </button>
      </div>
    </div>

    <!-- สรุปผล -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm text-center">
        <h2
          class="text-3xl font-extrabold mb-3"
          :class="examResult?.isPassed ? 'text-green-600' : 'text-red-600'"
        >
          {{ examResult?.isPassed ? 'Passed!' : 'Failed' }}
        </h2>
        <p class="text-sm text-gray-500 mb-1">Your points:</p>
        <p class="text-xl text-black-400 font-normal">
          {{ examResult?.score }}
          <span class="text-xl text-gray-400 font-normal">/ {{ examResult?.total }}</span>
        </p>

        <div
          v-if="examResult?.isPassed"
          class="bg-green-50 text-green-800 p-3 rounded mb-5 text-sm"
        >
          Congratulations! <br />
          You've been promoted to <strong>Level {{ examResult?.newLevel }}</strong>
        </div>
        <div v-else class="bg-red-50 text-red-800 p-3 rounded mb-5 text-sm">
          Try again, you still in level {{ userStore.user?.level }}
        </div>

        <button
          @click="closeModal"
          class="w-full bg-gray-800 text-white py-2 rounded hover:bg-gray-900 font-medium"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>
