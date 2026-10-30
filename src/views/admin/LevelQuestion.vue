<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import QuestionService from '@/service/QuestionService'

const route = useRoute()
// ดึง levelId จาก route parameter
const levelId = Number(route.params.id)
const questions = ref<any[]>([])

// เรียก Service ดึงข้อมูลข้อสอบตามlevel
function loadQuestions() {
  QuestionService.getQuestionsByLevel(levelId).then((res) => {
    questions.value = res.data
  })
}

onMounted(() => {
  loadQuestions()
})

// ยืนยันการลบและเรียก Service เพื่อลบข้อคำถาม
function deleteQuestion(id: number) {
  if (confirm('Are you sure you want to delete this question?')) {
    QuestionService.deleteQuestion(id).then(() => loadQuestions())
  }
}
</script>

<template>
  <div class="w-full">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold">Questions List</h2>
      <RouterLink
        :to="{ name: 'admin-levelQuestionAdd', params: { id: levelId } }"
        class="btn-main no-underline"
      >
        Add Question
      </RouterLink>
    </div>

    <div v-if="questions.length > 0" class="flex flex-col gap-4">
      <div
        v-for="question in questions"
        :key="question.id"
        class="p-4 border border-gray-300 rounded bg-white"
      >
        <p class="font-bold mb-3 text-lg">{{ question.title }}</p>

        <ol class="list-decimal ml-6 mb-4 text-sm space-y-2">
          <!-- ไฮไลตสีเขียวเฉพาะข้อถูก -->
          <li
            v-for="choice in question.choices"
            :key="choice.id"
            :class="{
              'text-green-600 font-bold': choice.isCorrect,
              'text-gray-700': !choice.isCorrect,
            }"
          >
            {{ choice.choiceText }}
          </li>
        </ol>

        <div class="flex justify-end gap-2 border-t pt-3 mt-2">
          <!-- ส่ง id ข้อสอบผ่าน query parameter เพื่อไปแก้ไข -->
          <RouterLink
            :to="{
              name: 'admin-levelQuestionEdit',
              params: { id: levelId },
              query: { qId: question.id },
            }"
            class="bg-yellow-500 text-white px-4 py-1.5 rounded hover:bg-yellow-600 text-sm no-underline"
          >
            Edit
          </RouterLink>
          <button
            @click="deleteQuestion(question.id)"
            class="bg-red-500 text-white px-4 py-1.5 rounded hover:bg-red-600 text-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

    <div v-else class="text-center text-gray-500 py-8 border rounded bg-white">
      No questions found for this level.
    </div>
  </div>
</template>
