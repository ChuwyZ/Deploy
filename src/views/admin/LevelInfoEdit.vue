<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useLevelStore } from '@/stores/level'
import LevelService from '@/service/LevelService'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'

const levelStore = useLevelStore()
const router = useRouter()

const loading = ref(false)
const errorMessage = ref('')
const schema = yup.object({
  passCriteriaScore: yup
    .number()
    .typeError('Pass criteria score must be a number')
    .required('Pass criteria score is required')
    .min(0, 'Score must be at least 0')
    .max(100, 'Score must not exceed 100')
    .integer('Score must be a whole number'),
})
const { handleSubmit, errors, setValues } = useForm({
  validationSchema: schema,
})

const { value: passCriteriaScore } = useField<number>('passCriteriaScore')

onMounted(() => {
  if (levelStore.level) {
    setValues({
      passCriteriaScore: levelStore.level.passCriteriaScore,
    })
  }
})

const save = handleSubmit((values) => {
  if (!levelStore.level) return

  loading.value = true
  errorMessage.value = ''

  LevelService.updateLevel(levelStore.level.id, {
    passCriteriaScore: values.passCriteriaScore,
  })
    .then((response) => {
      levelStore.setLevel(response.data)
      router.push({
        name: 'admin-levelInfo',
        params: { id: response.data.id },
      })
    })
    .catch((error) => {
      console.error(error)
      errorMessage.value = 'Unable to save level information.'
    })
    .finally(() => {
      loading.value = false
    })
})
</script>

<template>
  <div>
    <h2 class="text-xl mb-4 font-bold text-gray-800">Edit Level Information</h2>

    <p v-if="errorMessage" class="mb-3 text-red-600" role="alert">
      {{ errorMessage }}
    </p>

    <form @submit.prevent="save" class="flex flex-col gap-3">
      <div>
        <label class="block text-sm mb-1">Pass Criteria Score</label>
        <input
          v-model.number="passCriteriaScore"
          type="number"
          min="0"
          max="100"
          class="input w-full"
          :class="{ 'border-red-500': errors.passCriteriaScore }"
        />
        <span class="text-red-500 text-sm mt-1 block">
          {{ errors.passCriteriaScore }}
        </span>
      </div>

      <button type="submit" class="btn-main" :disabled="loading">
        {{ loading ? 'Saving...' : 'Save' }}
      </button>
    </form>
  </div>
</template>
