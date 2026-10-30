<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import QuestionService from '@/service/QuestionService'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'

const route = useRoute()
const router = useRouter()
// ดึง levelId จาก params และ questionId จาก query
const levelId = Number(route.params.id)
const questionId = Number(route.query.qId)

// เก็บ ID ของตัวเลือกเดิมไว้เพื่อใช้อัปเดตข้อมูลแทนการสร้างใหม่
const choiceIds = ref<number[]>([])

// กำหนด validation ห้ามเว้นว่างทุกช่องและต้องเลือกเฉลย 1 ข้อ
const schema = yup.object({
  title: yup.string().trim().required('Question title is required'),
  opt1: yup.string().trim().required('Choice 1 is required'),
  opt2: yup.string().trim().required('Choice 2 is required'),
  opt3: yup.string().trim().required('Choice 3 is required'),
  opt4: yup.string().trim().required('Choice 4 is required'),
  correct: yup
    .number()
    .required('Please select the correct answer')
    .typeError('Please select the correct answer'),
})

const { handleSubmit, errors, setValues } = useForm({ validationSchema: schema })

const { value: title } = useField<string>('title')
const { value: opt1 } = useField<string>('opt1')
const { value: opt2 } = useField<string>('opt2')
const { value: opt3 } = useField<string>('opt3')
const { value: opt4 } = useField<string>('opt4')
const { value: correct } = useField<number>('correct')

// ดึงข้อมูลข้อสอบเดิมมาเติมในฟอร์มเมื่อโหลดหน้าเว็บ
onMounted(() => {
  QuestionService.getQuestionsByLevel(levelId).then((res) => {
    const q = res.data.find((item: any) => item.id === questionId)
    if (q) {
      // เก็บ ID ของตัวเลือกทั้ง 4 ข้อไว้ใช้อัปเดตตอนกดบันทึก
      choiceIds.value = [q.choices[0]?.id, q.choices[1]?.id, q.choices[2]?.id, q.choices[3]?.id]

      let correctAns = 1
      // หาตำแหน่งของคำตอบที่ถูกต้องเพื่อเซ็ตค่าให้ Radio button
      q.choices.forEach((c: any, index: number) => {
        if (c.isCorrect) correctAns = index + 1
      })

      // เติมข้อมูลเดิมลงในช่องกรอกของฟอร์ม
      setValues({
        title: q.title,
        opt1: q.choices[0]?.choiceText,
        opt2: q.choices[1]?.choiceText,
        opt3: q.choices[2]?.choiceText,
        opt4: q.choices[3]?.choiceText,
        correct: correctAns,
      })
    }
  })
})

const save = handleSubmit((values: any) => {
  const payload = {
    title: values.title,
    levelId: levelId,
    choices: [
      { id: choiceIds.value[0], choiceText: values.opt1, isCorrect: values.correct === 1 },
      { id: choiceIds.value[1], choiceText: values.opt2, isCorrect: values.correct === 2 },
      { id: choiceIds.value[2], choiceText: values.opt3, isCorrect: values.correct === 3 },
      { id: choiceIds.value[3], choiceText: values.opt4, isCorrect: values.correct === 4 },
    ],
  }

  // เรียก API อัปเดตข้อสอบแล้วพากลับไปหน้ารายการข้อสอบ
  QuestionService.updateQuestion(questionId, payload).then(() => {
    router.push({ name: 'admin-levelQuestion', params: { id: levelId } })
  })
})
</script>

<template>
  <div>
    <h2 class="text-xl font-bold mb-4">Edit Question</h2>
    <form @submit.prevent="save" class="flex flex-col gap-4">
      <div>
        <label class="block font-bold mb-1"
          >Question Title <span class="text-red-500">*</span></label
        >
        <input
          v-model="title"
          type="text"
          class="input w-full"
          :class="{ 'border-red-500': errors.title }"
          placeholder="Enter question title"
        />
        <span class="text-red-500 text-sm mt-1 block">{{ errors.title }}</span>
      </div>

      <div class="p-4 border border-gray-300 rounded bg-white">
        <label class="block font-bold mb-2">Choices <span class="text-red-500">*</span></label>
        <span class="text-red-500 text-sm block mb-3">{{ errors.correct }}</span>

        <!-- Radio button เพื่อเลือกข้อที่ถูก -->
        <div class="flex items-center gap-2 mb-3">
          <input type="radio" v-model="correct" :value="1" class="w-4 h-4 cursor-pointer" />
          <input
            v-model="opt1"
            type="text"
            class="input flex-1"
            :class="{ 'border-red-500': errors.opt1 }"
            placeholder="Choice 1"
          />
          <span class="text-red-500 text-sm w-32">{{ errors.opt1 }}</span>
        </div>

        <div class="flex items-center gap-2 mb-3">
          <input type="radio" v-model="correct" :value="2" class="w-4 h-4 cursor-pointer" />
          <input
            v-model="opt2"
            type="text"
            class="input flex-1"
            :class="{ 'border-red-500': errors.opt2 }"
            placeholder="Choice 2"
          />
          <span class="text-red-500 text-sm w-32">{{ errors.opt2 }}</span>
        </div>

        <div class="flex items-center gap-2 mb-3">
          <input type="radio" v-model="correct" :value="3" class="w-4 h-4 cursor-pointer" />
          <input
            v-model="opt3"
            type="text"
            class="input flex-1"
            :class="{ 'border-red-500': errors.opt3 }"
            placeholder="Choice 3"
          />
          <span class="text-red-500 text-sm w-32">{{ errors.opt3 }}</span>
        </div>

        <div class="flex items-center gap-2">
          <input type="radio" v-model="correct" :value="4" class="w-4 h-4 cursor-pointer" />
          <input
            v-model="opt4"
            type="text"
            class="input flex-1"
            :class="{ 'border-red-500': errors.opt4 }"
            placeholder="Choice 4"
          />
          <span class="text-red-500 text-sm w-32">{{ errors.opt4 }}</span>
        </div>
      </div>

      <!-- Save and Cancel -->
      <div class="flex justify-end gap-3 mt-4 border-t pt-4">
        <RouterLink
          :to="{ name: 'admin-levelQuestion', params: { id: levelId } }"
          class="bg-gray-400 text-white py-2 px-5 rounded hover:bg-gray-500 transition-colors font-semibold no-underline text-center"
        >
          Cancel
        </RouterLink>
        <button type="submit" class="btn-main px-6">Save Changes</button>
      </div>
    </form>
  </div>
</template>
