<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import LevelService from '@/service/LevelService'

const route = useRoute()
const router = useRouter()
const levelId = Number(route.params.id)

const schema = yup.object({
  batch: yup.string().trim().required('Batch is required'),
  description: yup.string().trim().required('Description is required'),
})

const { handleSubmit, errors } = useForm({
  validationSchema: schema,
})

const { value: batch } = useField<string>('batch')
const { value: description } = useField<string>('description')

const save = handleSubmit((values) => {
  LevelService.addService({
    batch: values.batch,
    description: values.description,
    level: { id: levelId },
  })
    .then(() => {
      router.push({
        name: 'admin-levelService',
        params: { id: levelId },
      })
    })
    .catch((error) => {
      console.error('Add service failed:', error.response?.data || error)
      alert('Failed to add service.')
    })
})
</script>

<template>
  <div>
    <h2 class="text-xl mb-4 font-bold text-gray-800">Add New Service</h2>

    <form @submit.prevent="save" class="flex flex-col gap-4">
      <div>
        <label class="block font-bold mb-1">
          Batch <span class="text-red-500">*</span>
        </label>
        <input
          v-model="batch"
          type="text"
          class="input w-full"
          :class="{ 'border-red-500': errors.batch }"
          placeholder="Enter batch"
        />
        <span class="text-red-500 text-sm mt-1 block">
          {{ errors.batch }}
        </span>
      </div>

      <div>
        <label class="block font-bold mb-1">
          Description <span class="text-red-500">*</span>
        </label>
        <input
          v-model="description"
          type="text"
          class="input w-full"
          :class="{ 'border-red-500': errors.description }"
          placeholder="Enter service description"
        />
        <span class="text-red-500 text-sm mt-1 block">
          {{ errors.description }}
        </span>
      </div>

      <div class="flex justify-end gap-3 mt-4 border-t pt-4">
        <RouterLink
          :to="{ name: 'admin-levelService', params: { id: levelId } }"
          class="bg-gray-400 text-white py-2 px-5 rounded hover:bg-gray-500 transition-colors font-semibold no-underline text-center"
        >
          Cancel
        </RouterLink>

        <button type="submit" class="btn-main px-6">Save</button>
      </div>
    </form>
  </div>
</template>
